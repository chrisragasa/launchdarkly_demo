# Technical Overview

## Purpose
This app demonstrates LaunchDarkly's core capabilities: feature flags, user targeting, experimentation, and AI Configs. It simulates a SaaS pricing page that toggles between a legacy static view and a new interactive calculator.

---

## LaunchDarkly Integration

### 1. Client Initialization

#### Frontend (`src/main.tsx`)
```typescript
import { LDProvider } from 'launchdarkly-react-client-sdk';

const clientSideID = import.meta.env.VITE_LD_CLIENT_SIDE_ID;

const defaultUser = {
  kind: 'user',
  key: 'user-anonymous',
  name: 'Anonymous User',
  email: 'anonymous@example.com',
  role: 'guest',
  region: 'US-West',
  country: 'USA',
};

<LDProvider clientSideID={clientSideID} context={defaultUser}>
  <App />
</LDProvider>
```

**What's happening:**
- `LDProvider` initializes LaunchDarkly React SDK
- `clientSideID` connects to your LaunchDarkly environment
- `context` (user object) is sent to LaunchDarkly for targeting
- All child components can now access flags via hooks

#### Backend (`backend/server.js`)
```javascript
import LaunchDarkly from '@launchdarkly/node-server-sdk';

const ldClient = LaunchDarkly.init(process.env.LD_SDK_KEY);
await ldClient.waitForInitialization();
```

**What's happening:**
- Server-side SDK initializes with SDK key (not client-side ID)
- `waitForInitialization()` ensures flags are loaded before handling requests
- Backend evaluates AI Configs (not available on client-side SDK)

**Connection:** Frontend and backend are separate LD clients. Frontend evaluates feature flags (UI toggles). Backend evaluates AI Configs (security - keeps API keys server-side).

---

### 2. Flag Evaluation

#### Frontend - Boolean Flags (`src/App.tsx`)
```typescript
import { useFlags } from 'launchdarkly-react-client-sdk';

const { newPricingCalculator, thirtyDayFreeTrial } = useFlags();

// Conditional rendering based on flag
{newPricingCalculator ? (
  <PricingCalculator />  // New interactive UI
) : (
  <LegacyPricing />      // Old static UI
)}

{thirtyDayFreeTrial && (
  <button>Start 30-Day Free Trial</button>  // Only shows if flag is ON
)}
```

**What's happening:**
- `useFlags()` returns all flag values for current user
- Flags are evaluated by LaunchDarkly based on targeting rules
- React automatically re-renders when flags change (via streaming)

#### Backend - AI Configs (`backend/server.js`)
```javascript
const aiConfig = await ldClient.variation(
  'ai-pricing-assistant',  // Flag key
  userContext,             // User who made the request
  defaultConfig            // Fallback if flag doesn't exist
);

const modelId = aiConfig.model.name;        // e.g., "gpt-4"
const systemPrompt = aiConfig.messages[0].content;  // AI personality

await openai.chat.completions.create({
  model: modelId,         // Controlled by LaunchDarkly
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: question }
  ]
});
```

**What's happening:**
- `variation()` evaluates AI Config for specific user
- Returns different AI model/prompt based on targeting rules
- OpenAI call uses LaunchDarkly-controlled parameters

---

### 3. User Context Population

#### Initial Context (`src/main.tsx`)
Set when app loads:
```typescript
const defaultUser = {
  kind: 'user',          // Required by LaunchDarkly
  key: 'user-anonymous', // Unique identifier
  name: 'Anonymous User',
  email: 'anonymous@example.com',
  // Custom attributes for targeting:
  role: 'guest',
  region: 'US-West',
  country: 'USA',
};
```

#### Passing Context to Backend (`src/AIAssistant.tsx`)
```typescript
fetch('http://localhost:3001/api/ai-chat', {
  method: 'POST',
  body: JSON.stringify({
    question: 'Tell me about pricing',
    // User context sent to backend:
    userId: currentUser.key,
    userName: currentUser.name,
    userEmail: currentUser.email,
    userRole: currentUser.role,      // For targeting rules
    userRegion: currentUser.region,  // For geographic targeting
    userCountry: currentUser.country,
  }),
});
```

**What's happening:**
- Frontend sends user attributes with each API call
- Backend reconstructs context for flag evaluation
- Same user in frontend and backend = consistent experience

---

### 4. Context Switching Without Refresh (`src/ProfileSwitcher.tsx`)

```typescript
import { useLDClient } from 'launchdarkly-react-client-sdk';

const ldClient = useLDClient();

const handleUserSwitch = async (user: UserProfile) => {
  // Change user context dynamically
  await ldClient.identify({
    kind: 'user',
    key: user.key,
    name: user.name,
    email: user.email,
    role: user.role,
    region: user.region,
    country: user.country,
  });
  
  onUserChange(user);
};
```

**What's happening:**
1. User selects profile from dropdown
2. `ldClient.identify()` sends new context to LaunchDarkly
3. LaunchDarkly re-evaluates all flags for new user
4. `useFlags()` hook receives updated values
5. React re-renders components with new flag values
6. **No page refresh needed** - streaming connection updates instantly

**Flow:**
```
User clicks dropdown 
  → identify() called with new context
  → LaunchDarkly evaluates flags for new user
  → Streaming connection pushes updates
  → useFlags() triggers re-render
  → UI updates instantly
```

---

### 5. LaunchDarkly API Calls

#### `LDProvider` (Component)
**What it does:** Initializes LaunchDarkly connection and provides context to child components  
**When:** Once at app startup  
**Conceptually:** "Connect to LaunchDarkly and tell it who this user is"

#### `useFlags()` (Hook)
**What it does:** Returns current flag values for the user  
**When:** In any component that needs flag values  
**Conceptually:** "What flags should I show for this user?"

#### `useLDClient()` (Hook)
**What it does:** Returns LaunchDarkly client instance for advanced operations  
**When:** When you need to track events or change context  
**Conceptually:** "Give me direct access to LaunchDarkly SDK"

#### `ldClient.identify(context)` (Method)
**What it does:** Changes the current user context  
**When:** User switches profiles or logs in  
**Conceptually:** "Hey LaunchDarkly, I'm now a different user - re-evaluate flags"

#### `ldClient.track(event, data)` (Method)
**What it does:** Sends custom event to LaunchDarkly for experimentation  
**When:** User performs trackable action (e.g., clicks button)  
**Conceptually:** "Record that this user did something important for metrics"

#### `ldClient.flush()` (Method)
**What it does:** Forces immediate send of queued events  
**When:** Before user leaves page or in simulations  
**Conceptually:** "Don't wait - send all events to LaunchDarkly now"

#### `ldClient.variation(key, context, default)` (Method - Server-side)
**What it does:** Evaluates flag for specific user context  
**When:** Backend needs flag value for request  
**Conceptually:** "What should this user see for this flag?"

---

## Example Targeting Scenarios

### Scenario 1: Individual Targeting
**Setup:** Target specific user key directly  
**LaunchDarkly Rule:** `user-admin` → ON  
**Result:** Admin sees new calculator, everyone else sees legacy

### Scenario 2: Role-Based Targeting
**Setup:** Target by custom `role` attribute  
**LaunchDarkly Rule:** `IF role = "enterprise" THEN serve ON`  
**Result:** Enterprise users see calculator, others see legacy

### Scenario 3: Geographic Targeting
**Setup:** Target by region  
**LaunchDarkly Rule:** `IF region = "US-East" THEN serve ON`  
**Result:** Only US-East users see calculator

### Scenario 4: Percentage Rollout
**Setup:** Gradual rollout with randomization  
**LaunchDarkly Rule:** `50% of traffic → ON, 50% → OFF`  
**Result:** Random 50/50 split for A/B testing

---

## Experimentation Flow

1. **Setup Metric:** Create `contact-sales-clicked` event metric in LaunchDarkly
2. **Track Events:** App calls `ldClient.track('contact-sales-clicked', { value: 1 })`
3. **Create Experiment:** Link metric to `new-pricing-calculator` flag
4. **Traffic Simulation:** Button generates 35 random users, 30% conversion rate
5. **Results:** LaunchDarkly aggregates data and shows statistical significance

**Code (`src/App.tsx`):**
```typescript
ldClient.track('contact-sales-clicked', {
  value: 1,
  variation: newPricingCalculator ? 'smart-calculator' : 'legacy-pricing',
  flagValue: newPricingCalculator,
});
```

**Conceptually:** Every time someone clicks "Contact Sales", we tell LaunchDarkly which variation they saw and that they converted.

---

## Key Architectural Decisions

**Why separate frontend/backend LD clients?**
- Frontend: Fast UI toggles with client-side SDK
- Backend: Secure API keys and AI Configs with server-side SDK

**Why send user context to backend?**
- AI Configs require server-side evaluation
- Backend needs context to target appropriately

**Why use streaming instead of polling?**
- Real-time updates (< 1 second latency)
- Reduced network overhead
- Better user experience

**Why custom attributes (role, region)?**
- Enable powerful targeting rules
- Segment users beyond basic demographics
- Business-relevant groupings
