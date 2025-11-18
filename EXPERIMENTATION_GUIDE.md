# LaunchDarkly Experimentation Setup Guide

## What We Just Added to Your App

Your app now tracks **3 key events** that you can measure in LaunchDarkly experiments:

### Events Being Tracked:

| Event Key | When It Fires | Use Case |
|-----------|---------------|----------|
| `pricing-page-loaded` | Page loads | Track overall traffic to pricing page |
| `calculator-interaction` | User adjusts seats, plan, or billing | Measure engagement with calculator |
| `contact-sales-clicked` | User clicks "Contact Sales" button | **Primary conversion metric** |

---

## Setting Up Metrics in LaunchDarkly

### Step 1: Create Metrics

For each event key, create a corresponding metric in LaunchDarkly:

#### Metric 1: Contact Sales Clicks (Primary Conversion)
1. Go to **Experiments** → **Metrics** → **Create metric**
2. Fill in:
   - **Event kind:** Custom
   - **Event key:** `contact-sales-clicked` ← Must match exactly!
   - **Metric name:** "Contact Sales Button Clicks"
   - **Metric type:** **Binary** (did they click or not?)
   - **Maintainer:** Your name
3. Click **Create metric**

#### Metric 2: Calculator Interactions (Engagement)
1. **Event key:** `calculator-interaction`
2. **Metric name:** "Calculator Interactions"
3. **Metric type:** **Count** (how many times did they interact?)

#### Metric 3: Page Views (Traffic)
1. **Event key:** `pricing-page-loaded`
2. **Metric name:** "Pricing Page Views"
3. **Metric type:** **Count**

---

### Step 2: Create an Experiment

1. Go to **Experiments** → **Create experiment**
2. Fill in:
   - **Name:** "New Pricing Calculator"
   - **Hypothesis:** "The new interactive pricing calculator will drive more contact sales clicks than the legacy pricing blurb"
   - **Randomize by:** `user`
   - **Flag:** Select your `new-pricing-calculator` flag

---

### Step 3: Configure the Experiment

#### Select Metrics:
1. **Primary metric:** `contact-sales-clicked` (Binary)
   - This is what you're optimizing for
2. **Secondary metrics:** 
   - `calculator-interaction` (Count) - to measure engagement
   - `pricing-page-loaded` (Count) - to verify traffic distribution

#### Audience Targeting:
- **Who gets in the experiment?** 
  - Option 1: All users (remove individual targets!)
  - Option 2: Specific segment (e.g., only US users)

#### Allocation Split:
- **Control (false)** = 50% → Legacy pricing blurb
- **Treatment (true)** = 50% → New pricing calculator

---

### Step 4: Start the Experiment

1. Click **Start experiment**
2. LaunchDarkly will randomly assign users to control vs. treatment
3. Collect data for a few days/weeks
4. Review results in the **Experiments** dashboard

---

## How the Event Keys Work

### In Your Code:
```typescript
// When page loads
ldClient.track('pricing-page-loaded');

// When user interacts with calculator
ldClient.track('calculator-interaction', {
  interactionType: 'seats-adjusted'  // ← Additional context
});

// When user clicks contact sales (PRIMARY METRIC!)
ldClient.track('contact-sales-clicked', {
  value: 1  // ← For binary/numeric metrics
});
```

### In LaunchDarkly UI:
- The **Event key** field must match the string in `track('event-key')`
- Event key: `contact-sales-clicked` ← This connects your code to the metric!

---

## Understanding Metric Types

### Binary
- **Question:** "Did they do it?" (Yes/No)
- **Example:** `contact-sales-clicked` - either they clicked or they didn't
- **Measures:** Conversion rate (% of users who converted)

### Count  
- **Question:** "How many times did they do it?"
- **Example:** `calculator-interaction` - they might adjust seats 5 times
- **Measures:** Total interactions per user

### Numeric
- **Question:** "What's the numeric value?"
- **Example:** Revenue, time on page, cart value
- **Code:** `track('purchase-completed', { value: 299.99 })`
- **Measures:** Average value across users

---

## Interpreting Results

LaunchDarkly will show you:

### For Binary Metrics (contact-sales-clicked):
- **Control:** 5% conversion rate (5 out of 100 users clicked)
- **Treatment:** 8% conversion rate (8 out of 100 users clicked)
- **Result:** 🎉 **Treatment wins!** +60% improvement, statistically significant

### For Count Metrics (calculator-interaction):
- **Control:** 0 interactions (no calculator to interact with!)
- **Treatment:** 4.2 average interactions per user
- **Insight:** Users are engaging with the calculator

---

## Testing Your Events

### Method 1: Check Browser Console
Your events are being sent! You can verify by:
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Filter for "events" or "launchdarkly"
4. Interact with your app
5. See the events being sent to LD

### Method 2: LaunchDarkly Debugger
1. In LD UI, go to your flag
2. Click **Evaluations** tab
3. Find your user (e.g., `user-anonymous`)
4. See which events they've triggered

### Method 3: Event Explorer
1. In LD UI, go to **Event explorer** (left sidebar under Monitor)
2. Search for your event keys
3. See live events coming in

---

## Demo Workflow

### Test the Full Flow:

1. **Start your app:** `npm run dev`

2. **As Anonymous User (Control group):**
   - In LD UI: Set individual target `user-anonymous` → **false**
   - In app: Click "Contact Sales" button
   - LD records: `contact-sales-clicked` for variation **false**

3. **As Sarah Chen (Treatment group):**
   - In LD UI: Set individual target `user-sarah` → **true**  
   - In app: Adjust calculator (seats, plan, billing)
   - LD records: Multiple `calculator-interaction` events
   - Click... wait, the new calculator doesn't have a "Contact Sales" button!

### 🚨 Missing Feature Alert!
The new calculator needs a "Contact Sales" or "Get Started" button to track conversions!

---

## Want to Add a CTA Button to the New Calculator?

Let me know and I can add:
- "Contact Sales" button to the new calculator
- Track the same `contact-sales-clicked` event
- Compare conversion rates between the two UIs

This would give you a real experiment to measure! 🧪

---

## Key Takeaways

✅ **Event key in code** = **Event key in LD UI** (must match exactly!)  
✅ Create metrics for events you want to measure  
✅ Assign metrics to experiments  
✅ Let it run, collect data, make data-driven decisions  
✅ LaunchDarkly handles all the statistics for you!

Happy experimenting! 🚀
