# LaunchDarkly Demo: Feature Flags & AI Configs

A production-ready demonstration of LaunchDarkly's core capabilities including feature flags, user targeting, experimentation, and AI Configs with real-time OpenAI integration.

> **🎬 For Interviewers:** See [DEMO_SCRIPT.md](./DEMO_SCRIPT.md) for guided walkthrough  
> **⚡ Quick Start:** See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for rapid setup

---

## 🎯 What This Demo Showcases

### Core Features
- ✅ **Feature Flag Management** - Toggle features instantly without deployments
- ✅ **Individual & Rule-Based Targeting** - Serve different experiences by user attributes
- ✅ **A/B Testing & Experimentation** - Track metrics and validate business hypotheses
- ✅ **AI Configs** - Control AI model selection and prompts via LaunchDarkly
- ✅ **Real-time Updates** - Changes propagate instantly via streaming connections

### Technical Stack
- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** Node.js + Express + LaunchDarkly Node SDK
- **AI Integration:** OpenAI GPT-3.5/GPT-4
- **Feature Flags:** LaunchDarkly React Client SDK
- **State Management:** React Hooks

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- LaunchDarkly account (free trial available)
- OpenAI API key (optional, for AI features)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   cd backend && npm install && cd ..
   ```

2. **Configure environment variables:**
   
   **Frontend** (`.env` in project root):
   ```bash
   VITE_LD_CLIENT_SIDE_ID=your-client-side-id-here
   ```
   
   **Backend** (`backend/.env` - optional, for AI features):
   ```bash
   LD_SDK_KEY=your-server-sdk-key-here
   OPENAI_API_KEY=your-openai-api-key-here
   PORT=3001
   ```

3. **Run the application:**
   
   **Frontend only:**
   ```bash
   npm run dev
   ```
   
   **With AI backend** (in separate terminals):
   ```bash
   # Terminal 1 - Backend
   cd backend && npm start
   
   # Terminal 2 - Frontend
   npm run dev
   ```

4. **Open the app:**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend health check: [http://localhost:3001/health](http://localhost:3001/health)

---

## 🎬 Demo Flow

This application simulates a SaaS pricing page with multiple user personas and demonstrates progressive feature rollouts.

### Scenario: Rolling Out a New Pricing Calculator

**Current State:** Legacy pricing page with static information  
**Goal:** Launch interactive pricing calculator with risk mitigation

### 1️⃣ **Feature Flag Setup** (5 minutes)

Create a boolean flag in LaunchDarkly:
- **Key:** `newPricingCalculator`
- **Type:** Boolean
- **Default:** OFF (safe rollout)

**What You'll See:**
- Flag OFF → Legacy pricing page (simple text)
- Flag ON → Interactive calculator with sliders and real-time calculations

**Demo Action:** Toggle the flag in LaunchDarkly UI and watch the page update instantly (no refresh needed)

---

### 2️⃣ **User Targeting** (10 minutes)

The app includes 4 user personas with different attributes:

| User | Role | Region | Country | Use Case |
|------|------|--------|---------|----------|
| **Anonymous User** | guest | US-West | USA | Typical website visitor |
| **Sarah Chen** | enterprise | US-East | USA | Enterprise customer |
| **John Smith** | basic | EU-West | UK | International user |
| **Admin User** | admin | APAC | Singapore | Internal testing |

#### Individual Targeting
Target specific users by their unique key:
- Set `user-anonymous` → OFF (legacy experience for testing)
- Set `user-admin` → ON (internal preview)

#### Rule-Based Targeting
Create dynamic segments based on attributes:

**Example 1: Geographic Rollout**
```
IF country is "USA" 
THEN serve new calculator
ELSE serve legacy pricing
```

**Example 2: Customer Tier**
```
IF role is "enterprise"
THEN serve new calculator with custom messaging
```

**Example 3: Gradual Rollout**
```
Rule 1: role = "admin" → 100% ON
Rule 2: region = "US-East" → 50% ON (A/B test)
Rule 3: Default → 10% ON (gradual rollout)
```

**📖 Detailed Guide:** See [RULE_BASED_TARGETING.md](./RULE_BASED_TARGETING.md)

---

### 3️⃣ **Experimentation & Metrics** (15 minutes)

Validate the new calculator improves conversion rates.

#### Setup Experiment
1. Create metric: `contact-sales-clicked` (event tracking)
2. Create experiment on `newPricingCalculator` flag
3. Set hypothesis: "New calculator increases contact form submissions by 20%"
4. Allocate traffic: 50% control (OFF), 50% treatment (ON)

#### Test the Metrics
- Click "Contact Sales" button in both variations
- Check browser console for event tracking logs
- View real-time results in LaunchDarkly Experiments tab

**What to Measure:**
- Conversion rate (contact sales clicks)
- Time on page
- Engagement with calculator controls

**📖 Detailed Guide:** See [EXPERIMENTATION_GUIDE.md](./EXPERIMENTATION_GUIDE.md)

---

### 4️⃣ **AI Configs Integration** (20 minutes)

Control AI behavior through LaunchDarkly without code deployments.

#### Setup AI Config
1. Create AI Config: `ai-pricing-assistant`
2. Define variations:
   - **Friendly Helper** - GPT-4, casual tone, emojis
   - **Professional Consultant** - GPT-4, formal tone, detailed responses

#### Configuration Options
```json
{
  "model": { "name": "gpt-4" },
  "messages": [{
    "role": "system",
    "content": "You are a friendly pricing assistant..."
  }],
  "temperature": 0.7,
  "maxTokens": 200
}
```

#### Demo Scenarios

**Scenario 1: User Segmentation**
- Anonymous users → Friendly Helper (accessible, casual)
- Enterprise users → Professional Consultant (detailed, formal)

**Scenario 2: A/B Test AI Personalities**
- 50% get friendly assistant
- 50% get professional consultant
- Measure which converts better

**Scenario 3: Instant Prompt Updates**
- Update system prompt in LaunchDarkly
- Changes apply immediately (no redeploy!)
- Test different sales strategies in real-time

**📖 Setup Guide:** See [QUICKSTART_AI_BACKEND.md](./QUICKSTART_AI_BACKEND.md)

---

## 💡 Key Takeaways for Interviewers

This demo illustrates real-world LaunchDarkly use cases:

1. **Progressive Delivery** - Launch features to internal users first, then gradually roll out
2. **Risk Mitigation** - Instant rollback via flag toggle if issues arise
3. **Personalization** - Different experiences based on user attributes (role, region, etc.)
4. **Data-Driven Decisions** - A/B test features and measure business impact
5. **AI Governance** - Control AI behavior centrally without code changes
6. **Cost Optimization** - Use GPT-3.5 for basic users, GPT-4 for enterprise (via targeting rules)

---

## 📁 Project Structure

```
launchdarkly_demo/
├── src/
│   ├── main.tsx              # LaunchDarkly provider initialization
│   ├── App.tsx               # Main app with feature flag logic
│   ├── ProfileSwitcher.tsx   # User persona switcher component
│   ├── AIAssistant.tsx       # AI chat interface
│   └── *.css                 # Component styles
├── backend/
│   ├── server.js             # Express API + LaunchDarkly Node SDK + OpenAI
│   ├── package.json          # Backend dependencies
│   └── .env                  # Backend environment variables (git-ignored)
├── .env                      # Frontend environment variables (git-ignored)
├── README.md                 # This file
├── DEMO_GUIDE.md            # Individual targeting walkthrough
├── RULE_BASED_TARGETING.md  # Rule-based targeting examples
├── EXPERIMENTATION_GUIDE.md # A/B testing setup
└── QUICKSTART_AI_BACKEND.md # AI backend setup instructions
```

## 🔧 Key Implementation Details

### Frontend: LaunchDarkly React SDK

**Provider Setup** (`main.tsx`):
```typescript
import { LDProvider } from 'launchdarkly-react-client-sdk';

const clientSideID = import.meta.env.VITE_LD_CLIENT_SIDE_ID;

// User context sent to LaunchDarkly for targeting
const context = {
  kind: 'user',
  key: 'user-anonymous',
  name: 'Anonymous User',
  role: 'guest',
  region: 'US-West',
  country: 'USA'
};

<LDProvider clientSideID={clientSideID} context={context}>
  <App />
</LDProvider>
```

**Reading Flags** (`App.tsx`):
```typescript
import { useFlags, useLDClient } from 'launchdarkly-react-client-sdk';

const { newPricingCalculator } = useFlags();
const ldClient = useLDClient();

// Track events for experimentation
ldClient.track('contact-sales-clicked', { value: 1 });
```

**Switching Users** (`ProfileSwitcher.tsx`):
```typescript
// Update user context dynamically
await ldClient.identify({
  kind: 'user',
  key: 'user-sarah',
  name: 'Sarah Chen',
  email: 'sarah@enterprise.com',
  role: 'enterprise',
  region: 'US-East',
  country: 'USA'
});
```

---

### Backend: LaunchDarkly Node SDK + OpenAI

**Server Initialization** (`backend/server.js`):
```javascript
import LaunchDarkly from '@launchdarkly/node-server-sdk';
import OpenAI from 'openai';

const ldClient = LaunchDarkly.init(process.env.LD_SDK_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

await ldClient.waitForInitialization();
```

**AI Config Evaluation**:
```javascript
// Get AI Config variation based on user context
const aiConfig = await ldClient.variation(
  'ai-pricing-assistant',
  userContext,
  defaultConfig
);

// Extract model and prompt from LaunchDarkly
const modelId = aiConfig.model.name; // e.g., "gpt-4"
const systemPrompt = aiConfig.messages[0].content;

// Call OpenAI with LaunchDarkly-controlled parameters
const completion = await openai.chat.completions.create({
  model: modelId,
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: question }
  ]
});
```

---

## 📚 Documentation Index

| Guide | Purpose | Time |
|-------|---------|------|
| [DEMO_GUIDE.md](./DEMO_GUIDE.md) | Individual user targeting walkthrough | 5 min |
| [RULE_BASED_TARGETING.md](./RULE_BASED_TARGETING.md) | Create targeting rules by region, role, etc. | 10 min |
| [EXPERIMENTATION_GUIDE.md](./EXPERIMENTATION_GUIDE.md) | Set up A/B tests and track metrics | 15 min |
| [QUICKSTART_AI_BACKEND.md](./QUICKSTART_AI_BACKEND.md) | Configure AI backend with OpenAI | 20 min |
| [AI_CONFIG_DEMO.md](./AI_CONFIG_DEMO.md) | Mock AI demo (no backend required) | 5 min |

---

## 🎓 Interview Discussion Points

### Technical Architecture
- **Why separate backend for AI?** Security - API keys never exposed to client
- **Real-time updates?** LaunchDarkly's streaming connection (SSE) pushes changes
- **User context design?** Custom attributes enable powerful targeting rules

### Business Value
- **Deployment risk?** Feature flags provide instant rollback capability
- **Experimentation?** Data-driven decisions via A/B testing
- **AI costs?** Dynamic model selection (GPT-3.5 vs GPT-4) based on user tier

### Scale Considerations
- **Performance?** LaunchDarkly caches flags locally, sub-millisecond evaluation
- **Multi-region?** Target users by geographic attributes
- **Governance?** Centralized control of AI prompts and models

---

## 🔐 Security Best Practices

✅ **Environment Variables** - API keys stored in `.env`, never committed  
✅ **Client vs Server SDK** - Client SDK for frontend, Server SDK for backend  
✅ **API Key Separation** - OpenAI keys only on backend, never exposed to browser  
✅ **CORS Configuration** - Backend restricts requests to known origins  
✅ **Git Ignore** - `.env` files excluded from version control  

---

## � Troubleshooting

### Frontend Issues
**Flag returns `undefined`:**
- Verify flag key matches exactly (`newPricingCalculator`)
- Check LaunchDarkly UI - flag must be created and published
- Ensure `VITE_LD_CLIENT_SIDE_ID` is set correctly

**Changes don't appear:**
- Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+F5)
- Check browser console for LaunchDarkly connection logs
- Verify flag is ON in LaunchDarkly UI

### Backend Issues
**"LaunchDarkly not initialized":**
- Check `LD_SDK_KEY` in `backend/.env`
- Ensure using **Server SDK key** (not client-side ID)
- Look for initialization logs in terminal

**"OpenAI API error":**
- Verify `OPENAI_API_KEY` is valid
- Check OpenAI account has available credits
- Review error message in backend terminal logs

### AI Config Issues
**Wrong AI personality:**
- Check targeting rules priority (Individual > Rules > Default)
- Verify user context matches expected attributes
- Review backend logs for variation key

---

## 📞 Questions?

For interview discussions or technical questions, refer to:
- LaunchDarkly Docs: [docs.launchdarkly.com](https://docs.launchdarkly.com)
- This demo's guides in the repository root

---

## 📝 License

MIT - Feel free to use this demo for learning and interviews.
