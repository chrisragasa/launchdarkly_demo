import { useState } from 'react';
import { useFlags, useLDClient } from 'launchdarkly-react-client-sdk';
import { ProfileSwitcher, userProfiles, type UserProfile } from './ProfileSwitcher';
import { AIAssistant } from './AIAssistant';
import './App.css';

function App() {
  const { newPricingCalculator } = useFlags();
  const ldClient = useLDClient();
  const [currentUser, setCurrentUser] = useState<UserProfile>(userProfiles[0]);
  const [seats, setSeats] = useState(10);
  const [plan, setPlan] = useState<'basic' | 'pro'>('basic');
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');

  const pricePerUser = plan === 'basic' ? 20 : 40;
  const monthlyTotal = seats * pricePerUser;
  const annualTotal = seats * pricePerUser * 12 * 0.8;
  const savings = seats * pricePerUser * 12 - annualTotal;

  // Track contact sales button click
  const handleContactSalesClick = () => {
    if (ldClient) {
      const eventData = {
        value: 1,
        variation: newPricingCalculator ? 'smart-calculator' : 'legacy-pricing',
        flagValue: newPricingCalculator,
      };
      console.log('📊 Tracking: contact-sales-clicked', eventData);
      ldClient.track('contact-sales-clicked', eventData);
    }
    alert('Thank you! Our sales team will contact you shortly.');
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1>ABC Company</h1>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h2>Ship new pricing experiences safely with LaunchDarkly</h2>
        <ProfileSwitcher currentUser={currentUser} onUserChange={setCurrentUser} />
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
        <div className="flag-indicator">
          Flag Status: <strong>{newPricingCalculator ? '🟢 ON' : '🔴 OFF'}</strong>
        </div>

        {newPricingCalculator ? (
          // New Pricing Calculator
          <div className="pricing-calculator">
            <h3>Smart Pricing Calculator</h3>
            <p className="subtitle">Customize your plan and see real-time pricing</p>

            <div className="form-group">
              <label>
                Number of Seats: <strong>{seats}</strong>
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
                className="slider"
              />
              <div className="range-labels">
                <span>1</span>
                <span>100</span>
              </div>
            </div>

            <div className="form-group">
              <label>Plan Tier</label>
              <div className="button-group">
                <button
                  className={plan === 'basic' ? 'active' : ''}
                  onClick={() => setPlan('basic')}
                >
                  Basic<br />
                  <small>$20/user/mo</small>
                </button>
                <button
                  className={plan === 'pro' ? 'active' : ''}
                  onClick={() => setPlan('pro')}
                >
                  Pro<br />
                  <small>$40/user/mo</small>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Billing Cycle</label>
              <div className="button-group">
                <button
                  className={billing === 'monthly' ? 'active' : ''}
                  onClick={() => setBilling('monthly')}
                >
                  Monthly
                </button>
                <button
                  className={billing === 'annual' ? 'active' : ''}
                  onClick={() => setBilling('annual')}
                >
                  Annual<br />
                  <small>Save 20%</small>
                </button>
              </div>
            </div>

            <div className="total-display">
              <div className="total-label">Total Cost</div>
              <div className="total-amount">
                ${billing === 'monthly' ? monthlyTotal.toLocaleString() : annualTotal.toLocaleString()}
                <span className="period">/{billing === 'monthly' ? 'month' : 'year'}</span>
              </div>
              {billing === 'annual' && (
                <div className="savings">
                  💰 You save ${savings.toLocaleString()} per year with annual billing!
                </div>
              )}
            </div>

            <button className="contact-button" onClick={handleContactSalesClick}>
              Contact Sales
            </button>
          </div>
        ) : (
          // Legacy Pricing Blurb
          <div className="legacy-pricing">
            <h3>Pricing</h3>
            <p className="price-text">
              Pricing starts at <strong>$20/user/month</strong>.
            </p>
            <p>Contact sales for more details and custom enterprise plans.</p>
            <button className="contact-button" onClick={handleContactSalesClick}>
              Contact Sales
            </button>
          </div>
        )}
      </section>

      {/* AI Assistant */}
      <AIAssistant currentUser={currentUser} />
    </div>
  );
}

export default App;
