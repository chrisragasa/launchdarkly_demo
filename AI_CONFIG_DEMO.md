# AI Assistant Demo with LaunchDarkly AI Configs

## What You Just Built

A **mock AI chatbot** that demonstrates LaunchDarkly AI Configs without needing a backend or real AI API calls. This is perfect for showcasing the AI Config feature in demos!

---

## Setup in LaunchDarkly UI

### Step 1: Create the AI Config Flag

1. Go to **Flags** → **Create flag**
2. **Flag key:** `ai-assistant-config`
3. **Flag type:** **JSON**
4. **Name:** "AI Assistant Config"
5. **Description:** "Controls the AI pricing assistant's behavior and personality"

### Step 2: Create Variations

#### Variation 1: "Friendly Helper" (Default TRUE)

```json
{
  "enabled": true,
  "personality": "friendly",
  "greeting": "👋 Hey there! I'm your pricing buddy. What can I help you figure out?",
  "responses": {
    "basic_plan": "Great choice! The Basic plan is perfect for small teams. It's just $20 per user per month. Simple and affordable! 😊",
    "pro_plan": "Awesome! The Pro plan gives you all the premium features for $40 per user per month. It's our most popular choice! 🚀",
    "annual_savings": "Oh, you're smart! Going annual saves you 20% - that's a pretty sweet deal if you ask me! 💰",
    "comparison": "So here's the deal: Basic ($20/user/mo) is great for getting started, while Pro ($40/user/mo) unlocks everything. What matters most to your team?"
  }
}
```

#### Variation 2: "Professional Consultant" (Default FALSE)

```json
{
  "enabled": true,
  "personality": "professional",
  "greeting": "Good day. I'm your pricing consultant. How may I assist you with plan selection?",
  "responses": {
    "basic_plan": "The Basic plan, priced at $20 per user per month, provides essential features suitable for standard business operations.",
    "pro_plan": "The Professional plan, at $40 per user per month, includes advanced capabilities and premium support for enterprise requirements.",
    "annual_savings": "Annual billing provides a 20% cost reduction compared to monthly billing, representing significant savings for your organization.",
    "comparison": "Basic plan ($20/user/month) offers core functionality, while Professional plan ($40/user/month) includes comprehensive features. I recommend evaluating your specific requirements."
  }
}
```

#### Variation 3: "Disabled" (Optional)

```json
{
  "enabled": false,
  "personality": "none",
  "greeting": "",
  "responses": {
    "basic_plan": "",
    "pro_plan": "",
    "annual_savings": "",
    "comparison": ""
  }
}
```

### Step 3: Set Default Rule

- **When targeting is ON:** Serve **Variation 1 (Friendly)**
- **When targeting is OFF:** Serve **Variation 3 (Disabled)**

---

## Demo Scenarios

### Scenario 1: A/B Test AI Personalities

**Goal:** Test which AI personality drives more conversions

1. Create an experiment on the `ai-assistant-config` flag
2. **Control:** Friendly Helper
3. **Treatment:** Professional Consultant
4. **Metric:** `contact-sales-clicked`
5. **Hypothesis:** "A friendly AI assistant will increase user engagement and sales conversions"

### Scenario 2: Segment by User Role

**Goal:** Different AI personalities for different user types

**Rule 1:**
- `role` `is` `enterprise`
- Serve: **Professional Consultant**

**Rule 2:**
- `role` `is one of` `basic`, `guest`
- Serve: **Friendly Helper**

**Default:**
- Serve: **Disabled**

### Scenario 3: Geographic Personalization

**Goal:** Different tones for different regions

**Rule 1:**
- `country` `is` `USA`
- Serve: **Friendly Helper** (casual, American tone)

**Rule 2:**
- `country` `is one of` `UK`, `Singapore`
- Serve: **Professional Consultant** (formal, international tone)

### Scenario 4: Progressive Rollout

**Goal:** Safely roll out the AI assistant

1. **Week 1:** 10% of users → Friendly Helper
2. **Week 2:** 50% of users → Friendly Helper
3. **Week 3:** 100% of users → Friendly Helper
4. Monitor engagement metrics at each stage

---

## How It Works

### In Your App:

```typescript
const flags = useFlags();
const aiConfig = flags.aiAssistantConfig;

// If enabled = false, the assistant won't render
// If enabled = true, shows the personality and responses from the config
```

### The Magic:

- **No code changes needed** to update the AI's personality!
- **No backend required** - it's all client-side with mock responses
- **Instant updates** - change the flag, see the personality change immediately
- **Demonstrates the concept** of AI Config management perfectly

---

## Testing Your AI Assistant

### Test 1: Toggle On/Off

1. In LaunchDarkly, set `ai-assistant-config` → **Disabled** variation
2. In your app: AI button should disappear
3. Set it back to **Friendly Helper**
4. AI button reappears with friendly greeting

### Test 2: Personality Switch

1. Set to **Friendly Helper**
2. Click "Ask AI" button
3. Ask about "Tell me about Basic"
4. Notice the casual, friendly response

5. Switch to **Professional Consultant** in LaunchDarkly
6. Reset the chat in your app (🔄 button)
7. Ask the same question
8. Notice the formal, professional tone

### Test 3: Individual Targeting

1. Set individual target: `user-sarah` → **Professional Consultant**
2. Set individual target: `user-john` → **Friendly Helper**
3. Switch between users in your app
4. Watch the AI personality change!

---

## Key Demo Talking Points

✅ **"No code changes to update AI behavior"** - Just change the flag!  
✅ **"A/B test different AI personalities"** - Which one converts better?  
✅ **"Segment users for personalized experiences"** - Enterprise gets formal, startups get friendly  
✅ **"Roll out safely with gradual traffic allocation"** - Start at 10%, scale to 100%  
✅ **"Instant rollback if something goes wrong"** - Just flip the flag  

---

## What This Demonstrates

### AI Config Capabilities:
- ✅ Dynamic personality/tone control
- ✅ Prompt management without deployments
- ✅ User segmentation for personalization
- ✅ A/B testing AI variations
- ✅ Instant updates and rollbacks

### Real-World Applications:
- Customer service chatbots
- Content generation tools
- Recommendation engines
- Email copywriting assistants
- Code completion tools

---

## Next Steps

Want to make it even more impressive? You could:

1. **Add more personalities:** "Sales-focused", "Technical expert", "Casual friend"
2. **Add context awareness:** Assistant knows which plan the user is viewing
3. **Track AI interactions:** `ldClient.track('ai-question-asked', { question: '...' })`
4. **Create an experiment:** Test which personality drives more Contact Sales clicks

Happy demoing! 🚀🤖
