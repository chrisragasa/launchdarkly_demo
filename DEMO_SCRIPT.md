# 🎬 LaunchDarkly Demo Script

**Time:** 10-15 minutes  
**Audience:** Technical interviewers  
**Goal:** Demonstrate LaunchDarkly's core capabilities in a realistic SaaS scenario

---

## 📋 Pre-Demo Checklist

- [ ] Frontend running on `localhost:5173`
- [ ] Backend running on `localhost:3001` (for AI demo)
- [ ] LaunchDarkly dashboard open in browser tab
- [ ] Browser DevTools console open (for event tracking)
- [ ] Feature flag `newPricingCalculator` created and published
- [ ] AI Config `ai-pricing-assistant` created with 2 variations

---

## 🎯 Demo Narrative

### Opening (30 seconds)

> "I've built this demo to showcase LaunchDarkly's capabilities in a realistic scenario: rolling out a new pricing calculator for a SaaS company. We'll see feature flags, user targeting, experimentation, and AI Configs in action."

---

## Part 1: Feature Flags & Progressive Rollout (3 minutes)

### Setup
- Flag: `newPricingCalculator` (Boolean)
- Current state: OFF (showing legacy pricing page)

### Demo Steps

1. **Show Legacy Experience**
   ```
   "Right now, all users see the legacy pricing page - just static text. 
   This is our safe starting point."
   ```
   - Point out: Simple text, basic "Contact Sales" button

2. **Toggle Flag ON in LaunchDarkly**
   ```
   "Let's turn on the new calculator for everyone."
   ```
   - Go to LaunchDarkly UI
   - Toggle flag to ON
   - **Watch the page update instantly** (no refresh!)

3. **Show New Calculator**
   ```
   "Now users get an interactive calculator with real-time pricing updates.
   Notice: no deployment, no waiting - instant rollout."
   ```
   - Drag the seat slider
   - Toggle between Basic/Pro plans
   - Switch to annual billing to show 20% savings

### Key Talking Point
> "If we discover a bug, I can toggle this flag OFF immediately - instant rollback without a deployment cycle. This drastically reduces rollout risk."

---

## Part 2: User Targeting (4 minutes)

### Setup
- 4 user personas with different attributes
- Currently showing Rule-Based targeting with geographic exclusion
- Experiment running with 50/50 traffic split

### Demo Steps

1. **Show User Switcher**
   ```
   "We have 4 different user personas, each with unique attributes like role, 
   region, and country. This simulates real user segments."
   ```
   - Point out ProfileSwitcher component at top
   - Show Anonymous User (guest, US-West, USA)

2. **Explain Current Rule-Based Setup**
   ```
   "Right now, I have a rule configured: users in Singapore see the legacy 
   pricing. Everyone else enters the A/B test experiment."
   ```
   - Show LaunchDarkly targeting tab
   - Point out: Rule 1 - `country = "Singapore"` → false
   - Admin User (Singapore) will always see legacy (outside experiment)
   
   ```
   "This demonstrates how you can exclude certain regions or user segments 
   from experiments - useful for regulatory compliance, staged rollouts, 
   or known compatibility issues."
   ```

3. **Add Individual Targeting (Live Demo)**
   ```
   "Let me show individual targeting - the highest priority rule type."
   ```
   - In LaunchDarkly: Click "Add individual target"
   - Set `user-anonymous` → OFF
   - **Watch page revert to legacy pricing** (instant)
   
   ```
   "This is perfect for beta testing with specific customers, giving VIPs 
   early access, or quickly blocking certain users if issues arise."
   ```

4. **Demo Additional Rule-Based Targeting**
   ```
   "Let's add another rule for role-based access."
   ```
   
   **Option A: Role-Based Targeting**
   - Add rule: `role = "enterprise"` → true (above Singapore rule)
   - Only Sarah Chen (enterprise) bypasses experiment, gets calculator
   - Others follow existing rules
   
   **Option B: Geographic Expansion**
   - Modify existing rule or add new one
   - Example: `country = "UK"` → false (exclude UK from experiment)
   - John Smith (UK) now sees legacy, exits experiment
   
   ```
   "Rule order matters - LaunchDarkly evaluates top-to-bottom. 
   First match wins, so we put specific rules above general ones."
   ```

### Key Talking Point
> "Notice the hierarchy: Individual targets override everything, then rules evaluate in order, then default rule (in our case, the experiment). This gives you precise control while keeping configuration simple."

---

## Part 3: Experimentation (3 minutes)

### Setup
- **Experiment:** "New Pricing Calculator" (currently running)
- **Metric:** `contact-sales-clicked` (Contact Sales Button Clicked)
- **Hypothesis:** "If I use a new dynamic pricing calculator, it will drive more user interactions"
- **Traffic Split:** 50% Control (legacy) / 50% Treatment (new calculator)
- **Started:** November 17th, 2025

### Demo Steps

1. **Show Running Experiment**
   ```
   "We have a live A/B test running right now. Let me show you the results."
   ```
   - Navigate to LaunchDarkly → Experiments tab
   - Show "New Pricing Calculator" experiment (Running status)
   - Point out: **5 user contexts exposed in past 2 days**
   - Show 50/50 traffic allocation

2. **Explain Hypothesis**
   ```
   "Our hypothesis: the new dynamic calculator will drive more user engagement 
   measured by contact sales clicks. LaunchDarkly is currently tracking this 
   in real-time across both variations."
   ```
   - Point to hypothesis text in UI
   - Show primary metric: "Contact Sales Button Clicked"
   - Note: "Control is most likely to be best" (as of now)

3. **Show Event Tracking in Action**
   ```
   "Let's generate some data. When users click 'Contact Sales', 
   we track that event to LaunchDarkly."
   ```
   - Open browser DevTools console
   - Click "Contact Sales" button
   - Show console log: `📊 Tracking: contact-sales-clicked { value: 1 }`
   - Alert appears: "Thank you! Our sales team will contact you shortly."

4. **Demonstrate Fair Testing**
   ```
   "Both variations have the same 'Contact Sales' button - 
   legacy pricing and new calculator both have it. This ensures we're 
   measuring fairly and the only variable is the calculator itself."
   ```
   - Refresh page or switch users to potentially see other variation
   - Point out: Both have Contact Sales button positioned similarly

5. **Review Results (if sufficient data)**
   ```
   "In the Results tab, LaunchDarkly shows which variation is performing better 
   with statistical confidence. We need 100 exposures per treatment for reliable 
   estimates, but we can see the trend even with limited data."
   ```
   - Show Results tab: "Not enough traffic" message if still early
   - Explain: Bayesian analysis, confidence intervals, probability to beat control

### Key Talking Point
> "This is data-driven product development. Instead of guessing, we can validate our hypotheses with real user behavior. If the new calculator doesn't move the needle on conversions, we might not fully roll it out - saving engineering time and preventing feature bloat."

---

## Part 4: AI Configs (4 minutes)

### Setup
- AI Config: `ai-pricing-assistant`
- Variations: Friendly Helper (GPT-4), Professional Consultant (GPT-4)
- Backend: Node.js + LaunchDarkly Node SDK + OpenAI

### Demo Steps

1. **Show AI Assistant**
   ```
   "Now let's see something unique - LaunchDarkly controlling AI behavior."
   ```
   - Click "🤖 Ask AI" button
   - Point out: "This calls our backend, which reads an AI Config from LaunchDarkly"

2. **Test with Anonymous User**
   ```
   "Anonymous User is targeted to get the 'Friendly Helper' personality."
   ```
   - Ask: "Tell me about the Basic plan"
   - Show response (friendly, casual tone, emojis)
   - **Point to backend terminal logs:**
     ```
     🎭 Variation: friendly-helper
     🤖 Using model: gpt-4
     ```

3. **Switch to Enterprise User**
   ```
   "Now let's switch to Sarah Chen, our enterprise customer."
   ```
   - Switch user via ProfileSwitcher
   - Click Reset in AI assistant
   - Ask same question
   - Show response (professional, formal tone)
   - **Show backend logs:**
     ```
     🎭 Variation: professional-consultant
     🤖 Using model: gpt-4
     ```

4. **Demonstrate Instant Updates**
   ```
   "The power here: I can update the AI prompt in LaunchDarkly 
   and changes apply immediately - no code deployment."
   ```
   - Go to LaunchDarkly AI Config UI
   - Show the system prompts for each variation
   - Explain: model selection, prompt templates, parameters
   
   ```
   "Teams can A/B test AI personalities, update prompts for better results, 
   or swap models (GPT-3.5 to GPT-4) without engineering involvement."
   ```

### Key Talking Point
> "This solves a major challenge in production AI: governance and iteration speed. Product teams can refine prompts based on user feedback, data science can optimize model selection, and we can instantly roll back if an AI behaves unexpectedly."

---

## Closing (1 minute)

### Summary
```
"To recap, we've demonstrated:
1. Feature flags for risk-free deployments
2. User targeting - both individual and rule-based
3. A/B testing to validate business impact
4. AI Configs for dynamic AI behavior control

All of these capabilities work together to enable continuous delivery 
while maintaining control and minimizing risk."
```

### Technical Highlights
- **Real-time updates** via streaming connections
- **Separation of concerns** - business logic in LaunchDarkly, not code
- **Security best practices** - API keys on backend only
- **Full-stack integration** - React client SDK + Node server SDK

---

## 🎯 Questions to Anticipate

### "How does targeting priority work?"
> "LaunchDarkly evaluates in order: Individual targets (highest priority), then custom rules top-to-bottom, then default rule. This is why we had to remove the individual target before testing rules."

### "What's the performance impact?"
> "LaunchDarkly caches flags locally and uses streaming for updates. Flag evaluation is sub-millisecond. The client SDK maintains a persistent connection for real-time updates without polling."

### "How do you handle flag cleanup?"
> "Temporary flags (experiments, rollouts) should be removed after serving their purpose. LaunchDarkly provides flag insights showing which flags are stale or unused. Permanent flags (kill switches, entitlements) can remain indefinitely."

### "What about backend AI security?"
> "This architecture ensures API keys never reach the browser. The frontend sends user context and questions to our backend, which handles all LaunchDarkly and OpenAI API calls. This is the recommended pattern for production AI features."

### "Can you show me the code?"
> "Absolutely!" - Navigate to key files:
> - `src/main.tsx` - LaunchDarkly provider setup
> - `src/App.tsx` - Feature flag usage
> - `src/ProfileSwitcher.tsx` - User context management
> - `backend/server.js` - AI Config integration

---

## 📝 Notes

- **Timing:** Adjust based on interviewer engagement
- **Technical depth:** Scale complexity based on audience
- **Preparation:** Test the full flow before the interview
- **Backup plan:** Have screenshots ready if live demo has issues
- **Questions:** Encourage questions throughout, not just at the end

---

Good luck! 🚀
