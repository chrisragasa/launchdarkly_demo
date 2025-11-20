import { useState } from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';
import type { UserProfile } from './ProfileSwitcher';
import './AIAssistant.css';

interface AIConfig {
  enabled: boolean;
  personality: string;
  greeting: string;
  responses: {
    basic_plan: string;
    pro_plan: string;
    annual_savings: string;
    comparison: string;
  };
}

const defaultConfig: AIConfig = {
  enabled: true,  // Changed to true so it shows by default
  personality: 'friendly',
  greeting: '👋 Hi! Ask me about pricing!',
  responses: {
    basic_plan: 'Basic plan is $20/user/month.',
    pro_plan: 'Pro plan is $40/user/month.',
    annual_savings: 'Annual billing saves 20%.',
    comparison: 'Basic is $20/mo, Pro is $40/mo.',
  },
};

interface AIAssistantProps {
  currentUser: UserProfile;
}

export function AIAssistant({ currentUser }: AIAssistantProps) {
  const flags = useFlags();
  const aiConfig: AIConfig = flags.aiAssistantConfig || defaultConfig;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  if (!aiConfig.enabled) {
    return null;
  }

  const quickQuestions = [
    { label: 'Tell me about Basic', question: 'Tell me about the Basic plan' },
    { label: 'Tell me about Pro', question: 'Tell me about the Pro plan' },
    { label: 'What about annual billing?', question: 'What savings do I get with annual billing?' },
    { label: 'Compare plans', question: 'Can you compare the Basic and Pro plans for me?' },
  ];

  const handleQuickQuestion = async (questionText: string, label: string) => {
    // Add user message immediately
    setMessages((prev) => [...prev, { role: 'user', content: label }]);
    setIsLoading(true);

    try {
      // Call backend API with full user context
      const response = await fetch('http://localhost:3001/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: questionText,
          userId: currentUser.key,
          userName: currentUser.name,
          userEmail: currentUser.email,
          userRole: currentUser.role,
          userRegion: currentUser.region,
          userCountry: currentUser.country,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();

      // Log metadata for debugging
      console.log('🤖 AI Response Metadata:', data.metadata);

      // Add AI response
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.answer },
      ]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '❌ Sorry, I encountered an error. Please make sure the backend server is running.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button className="ai-chat-button" onClick={() => setIsOpen(!isOpen)}>
        🤖 {isOpen ? 'Close' : 'Ask AI'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="ai-chat-window">
          <div className="ai-chat-header">
            <div>
              <strong>AI Pricing Assistant</strong>
            </div>
            <button onClick={handleReset} className="reset-button">
              🔄 Reset
            </button>
          </div>

          <div className="ai-chat-messages">
            {/* Greeting Message */}
            <div className="ai-message assistant">
              <div className="message-content">{aiConfig.greeting}</div>
            </div>

            {/* Conversation Messages */}
            {messages.map((msg, idx) => (
              <div key={idx} className={`ai-message ${msg.role}`}>
                <div className="message-content">{msg.content}</div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="ai-message assistant">
                <div className="message-content">
                  <span className="loading-dots">Thinking...</span>
                </div>
              </div>
            )}

            {/* Quick Questions */}
            {!isLoading && (
              <div className="quick-questions">
                <p className="quick-questions-label">
                  {messages.length === 0 ? 'Quick questions:' : 'Ask another:'}
                </p>
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    className="quick-question-btn"
                    onClick={() => handleQuickQuestion(q.question, q.label)}
                    disabled={isLoading}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="ai-chat-footer">
            <small>
              🤖 Powered by LaunchDarkly AI Configs + OpenAI
              {isLoading && ' • Generating response...'}
            </small>
          </div>
        </div>
      )}
    </>
  );
}
