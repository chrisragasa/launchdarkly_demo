import { useState } from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';
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

export function AIAssistant() {
  const flags = useFlags();
  const aiConfig: AIConfig = flags.aiAssistantConfig || defaultConfig;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);

  if (!aiConfig.enabled) {
    return null;
  }

  const quickQuestions = [
    { label: 'Tell me about Basic', key: 'basic_plan' },
    { label: 'Tell me about Pro', key: 'pro_plan' },
    { label: 'What about annual billing?', key: 'annual_savings' },
    { label: 'Compare plans', key: 'comparison' },
  ];

  const handleQuickQuestion = (key: string) => {
    const question = quickQuestions.find((q) => q.key === key)?.label || '';
    const response = aiConfig.responses[key as keyof typeof aiConfig.responses];

    setMessages((prev) => [
      ...prev,
      { role: 'user', content: question },
      { role: 'assistant', content: response },
    ]);
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
              <span className="personality-badge">{aiConfig.personality}</span>
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

            {/* Quick Questions */}
            {messages.length === 0 && (
              <div className="quick-questions">
                <p className="quick-questions-label">Quick questions:</p>
                {quickQuestions.map((q) => (
                  <button
                    key={q.key}
                    className="quick-question-btn"
                    onClick={() => handleQuickQuestion(q.key)}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            )}

            {/* Show quick questions after responses too */}
            {messages.length > 0 && (
              <div className="quick-questions">
                <p className="quick-questions-label">Ask another:</p>
                {quickQuestions.map((q) => (
                  <button
                    key={q.key}
                    className="quick-question-btn"
                    onClick={() => handleQuickQuestion(q.key)}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="ai-chat-footer">
            <small>
              💡 Powered by LaunchDarkly AI Configs - Try switching users or changing flag variations!
            </small>
          </div>
        </div>
      )}
    </>
  );
}
