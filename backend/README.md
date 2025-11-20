# LaunchDarkly AI Backend

Backend API server that integrates LaunchDarkly AI Configs with OpenAI.

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Edit the `.env` file with your actual keys:

```env
# Get this from LaunchDarkly: Account Settings → Projects → Environments → SDK Key
LD_SDK_KEY=sdk-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Get this from https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

PORT=3001
```

### 3. Start the Server

```bash
npm start
```

You should see:
```
✅ LaunchDarkly SDK initialized
🚀 Backend server running on http://localhost:3001
📍 AI Chat endpoint: http://localhost:3001/api/ai-chat
```

### 4. Test the Health Endpoint

Open your browser to: http://localhost:3001/health

You should see:
```json
{
  "status": "ok",
  "message": "LaunchDarkly AI Backend is running",
  "ldReady": true
}
```

## How It Works

### 1. Receives Request from Frontend

```javascript
POST /api/ai-chat
{
  "question": "Tell me about the Basic plan",
  "userId": "user-sarah",
  "userRole": "enterprise",
  "userRegion": "US-East",
  "userCountry": "USA"
}
```

### 2. Gets AI Config from LaunchDarkly

The server reads the `ai-pricing-assistant` AI Config based on the user context (with targeting rules applied).

### 3. Calls OpenAI API

Uses the model and prompt from LaunchDarkly AI Config to generate a response.

### 4. Returns Response

```json
{
  "answer": "The Basic plan is perfect for small teams...",
  "metadata": {
    "model": "gpt-3.5-turbo",
    "tokensUsed": 45,
    "personality": "friendly"
  }
}
```

## API Endpoints

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "LaunchDarkly AI Backend is running",
  "ldReady": true
}
```

### POST /api/ai-chat
Chat with AI assistant.

**Request Body:**
```json
{
  "question": "Tell me about pricing",
  "userId": "user-123",
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "userRole": "enterprise",
  "userRegion": "US-West",
  "userCountry": "USA"
}
```

**Response:**
```json
{
  "answer": "Our Basic plan starts at $20 per user per month...",
  "metadata": {
    "model": "gpt-3.5-turbo",
    "tokensUsed": 52,
    "personality": "friendly"
  }
}
```

## LaunchDarkly AI Config Structure

Your `ai-pricing-assistant` AI Config should have this structure:

```json
{
  "model": {
    "modelId": "gpt-3.5-turbo"
  },
  "prompt": [{
    "role": "system",
    "content": "You are a helpful pricing assistant..."
  }],
  "temperature": 0.7,
  "maxTokens": 200,
  "personality": "friendly"
}
```

## Troubleshooting

### Error: "LaunchDarkly SDK not initialized"
- Check that your `LD_SDK_KEY` is correct (starts with `sdk-`)
- Make sure it's the **server-side SDK key**, not the client-side ID

### Error: "OpenAI API error"
- Verify your `OPENAI_API_KEY` is correct (starts with `sk-`)
- Check you have credits in your OpenAI account
- Make sure you've added payment info to OpenAI

### Port already in use
- Change `PORT=3001` in `.env` to another port like `3002`

## Security Notes

⚠️ **Never commit `.env` file to git!**  
✅ API keys are kept secure on the server  
✅ Frontend never sees the API keys  
✅ CORS is enabled for local development  

For production, configure CORS to only allow your frontend domain:
```javascript
app.use(cors({ origin: 'https://your-domain.com' }));
```

## Cost Monitoring

Monitor your OpenAI usage at: https://platform.openai.com/usage

Typical costs:
- GPT-3.5-turbo: ~$0.0015 per 1K tokens
- GPT-4: ~$0.03 per 1K tokens

A typical chat response uses 50-200 tokens.
