/**
 * LaunchDarkly AI Config Backend
 * 
 * This server integrates LaunchDarkly's AI Configs with OpenAI to demonstrate:
 * - Dynamic AI model selection (GPT-3.5 vs GPT-4)
 * - Prompt management without code deployments
 * - User-based targeting for personalized AI experiences
 * - A/B testing different AI personalities
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import LaunchDarkly from '@launchdarkly/node-server-sdk';
import OpenAI from 'openai';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // Parse JSON request bodies

// Initialize LaunchDarkly
const ldClient = LaunchDarkly.init(process.env.LD_SDK_KEY);

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Wait for LaunchDarkly to be ready
await ldClient.waitForInitialization();
console.log('✅ LaunchDarkly SDK initialized');

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'LaunchDarkly AI Backend is running',
    ldReady: ldClient.initialized()
  });
});

/**
 * AI Chat Endpoint
 * 
 * Handles AI assistant requests by:
 * 1. Receiving user context from frontend
 * 2. Fetching AI Config from LaunchDarkly based on user attributes
 * 3. Calling OpenAI with LaunchDarkly-controlled model and prompt
 * 4. Returning AI response with metadata
 */
app.post('/api/ai-chat', async (req, res) => {
  try {
    const { question, userId, userName, userEmail, userRole, userRegion, userCountry } = req.body;

    // Validate request
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Build user context for LaunchDarkly targeting
    // These attributes enable rule-based targeting (e.g., by role, region)
    const userContext = {
      kind: 'user',
      key: userId || 'anonymous',
      name: userName,
      email: userEmail,
      role: userRole,
      region: userRegion,
      country: userCountry,
    };

    console.log('📊 User context:', userContext);

    // Fetch AI Config from LaunchDarkly
    // The variation served depends on targeting rules (individual, rule-based, or default)
    const aiConfig = await ldClient.variation(
      'ai-pricing-assistant', // AI Config key in LaunchDarkly
      userContext,
      null // No default value; we'll use fallback config below
    );

    console.log('🚀 AI Config received:', aiConfig ? 'Found' : 'Using default');
    if (aiConfig) {
      console.log('📦 Full AI Config:', JSON.stringify(aiConfig, null, 2));
    }

    // Fallback configuration if LaunchDarkly is unavailable or flag doesn't exist
    const defaultConfig = {
      model: { modelId: 'gpt-3.5-turbo' },
      messages: [{
        role: 'system',
        content: 'You are a helpful pricing assistant for ABC Company. Basic plan is $20/user/month, Pro plan is $40/user/month. Annual billing saves 20%. Be concise and helpful.'
      }]
    };

    // Check if AI Config is enabled (_ldMeta.enabled returned by LaunchDarkly)
    const isEnabled = aiConfig?._ldMeta?.enabled !== false;
    const config = (aiConfig && isEnabled) ? aiConfig : defaultConfig;

    // Extract model ID from LaunchDarkly AI Config
    // LaunchDarkly returns: { model: { name: 'gpt-4', parameters: {} } }
    // We need to handle various structures for robustness
    let modelId;
    if (typeof config.model === 'string') {
      modelId = config.model;
    } else if (config.model?.name) {
      modelId = config.model.name; // LaunchDarkly AI Config structure
    } else if (config.model?.modelId) {
      modelId = config.model.modelId; // Alternative structure
    } else {
      modelId = 'gpt-3.5-turbo'; // Ultimate fallback
    }

    // Extract system prompt from messages array
    const systemMessage = config.messages?.[0] || config.prompt?.[0] || defaultConfig.messages[0];
    const systemPrompt = systemMessage.content;

    // Log configuration being used (helpful for debugging)
    console.log('🤖 Using model:', modelId);
    console.log('🎭 Variation:', aiConfig?._ldMeta?.variationKey || 'default');
    console.log('📝 System prompt:', systemPrompt.substring(0, 100) + '...');

    // Call OpenAI with LaunchDarkly-controlled parameters
    const completion = await openai.chat.completions.create({
      model: modelId, // Controlled by LaunchDarkly AI Config
      temperature: config.temperature || 0.7,
      max_tokens: config.maxTokens || 200,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: question
        }
      ]
    });

    // Extract AI response
    const answer = completion.choices[0].message.content;

    // Log success and details
    console.log('✅ Response generated successfully');
    console.log('💬 AI Response:', answer);
    console.log('📊 Tokens used:', completion.usage?.total_tokens || 0);

    // Return response with metadata
    res.json({
      answer,
      metadata: {
        model: modelId,
        tokensUsed: completion.usage?.total_tokens || 0,
        variationKey: aiConfig?._ldMeta?.variationKey || 'default'
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({
      error: 'Failed to process AI request',
      message: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📍 AI Chat endpoint: http://localhost:${PORT}/api/ai-chat`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await ldClient.close();
  process.exit(0);
});
