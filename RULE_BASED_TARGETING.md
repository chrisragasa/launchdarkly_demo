# Rule-Based Targeting Demo Guide

## What's the Difference?

### Individual Targeting (What You Just Tested)
- ✅ Uses **only** the `key` field
- ✅ Targets specific users by their unique identifier
- ✅ **Highest priority** - overrides all rules
- ❌ Cannot use email, role, region, or other attributes

**Example:** "Show new calculator to `user-anonymous` = false"

---

### Rule-Based Targeting (The Powerful Stuff)
- ✅ Uses **any custom attribute** you send to LaunchDarkly
- ✅ Create dynamic segments based on user properties
- ✅ Can combine multiple conditions with AND/OR logic
- ✅ Evaluated **after** individual targets but **before** default rule

**Example:** "Show new calculator to all users in EU-West region"

---

## Your Updated User Profiles

Each user now has geographic data:

| User | Key | Role | Region | Country |
|------|-----|------|--------|---------|
| Anonymous User | `user-anonymous` | guest | US-West | USA |
| Sarah Chen | `user-sarah` | enterprise | US-East | USA |
| John Smith | `user-john` | basic | EU-West | UK |
| Admin User | `user-admin` | admin | APAC | Singapore |

---

## Testing Rule-Based Targeting

### Example 1: Target by Region

**Goal:** Show new pricing calculator only to US users

1. In LaunchDarkly UI, click **"+ Add rule"** (the + button below individual targets)
2. Configure the rule:
   - **Attribute:** `country`
   - **Operator:** `is one of`
   - **Values:** `USA`
   - **Serve:** **true** (blue circle)
3. **Save** your changes
4. **Remove** your individual target for `user-anonymous` (or it will override the rule!)

**Test it:**
- Anonymous User (USA) → Should see new calculator ✅
- Sarah Chen (USA) → Should see new calculator ✅
- John Smith (UK) → Should see legacy pricing ❌
- Admin User (Singapore) → Should see legacy pricing ❌

---

### Example 2: Target by Role

**Goal:** Show new calculator only to enterprise customers

1. Add a new rule:
   - **Attribute:** `role`
   - **Operator:** `is`
   - **Value:** `enterprise`
   - **Serve:** **true**

**Test it:**
- Only Sarah Chen should see the new calculator
- Everyone else sees legacy pricing

---

### Example 3: Combine Multiple Conditions (AND logic)

**Goal:** Show to enterprise customers in the US only

1. Add a rule with **multiple conditions**:
   - `role` `is` `enterprise`
   - **AND** `country` `is` `USA`
   - **Serve:** **true**

**Test it:**
- Sarah Chen (enterprise, USA) → New calculator ✅
- If you add an enterprise user in UK → Legacy pricing ❌

---

### Example 4: Regional Rollout

**Goal:** Roll out to APAC first, then expand

**Rule 1:**
- `region` `is` `APAC`
- Serve: **true**

**Rule 2:** (add below Rule 1)
- `region` `is one of` `US-East`, `US-West`
- Serve: **50% true, 50% false** (percentage rollout)

**Result:**
- Admin User (APAC) → Always sees new calculator
- US users → 50/50 chance
- John Smith (EU) → Falls to default rule

---

## Priority & Evaluation Order

LaunchDarkly evaluates in this order (top = highest priority):

```
1. Individual Targets (by key only)
   └─ user-anonymous → false
   
2. Custom Rules (evaluated top to bottom)
   ├─ Rule 1: region = APAC → true
   ├─ Rule 2: role = enterprise → true
   └─ Rule 3: country = USA AND accountAge > 30 → true
   
3. Default Rule (fallback)
   └─ Serve: true (or percentage rollout)
```

### Example Scenario:
- **Individual Target:** `user-anonymous` → **false**
- **Rule 1:** `country` `is` `USA` → **true**
- **Default:** **true**

**Anonymous User gets false** because individual targeting wins!

---

## Common Use Cases

### Geographic Restrictions
```
region is one of: EU-West, EU-East
→ Serve GDPR-compliant version
```

### Beta Testing by Company Size
```
companySize > 100
→ Show enterprise features
```

### Gradual Rollout by Tier
```
Rule 1: tier is "premium" → 100% true
Rule 2: tier is "standard" → 50% true
Rule 3: tier is "free" → 10% true
```

### Time-Based (using custom attributes)
```
accountAgeDays > 30
→ Show advanced features to established users
```

---

## Pro Tips

1. **Individual Targets Override Everything** - Remove them when testing rules!
2. **Rule Order Matters** - Rules are evaluated top-to-bottom, first match wins
3. **Use Segments** - For complex conditions, create reusable segments in LaunchDarkly
4. **Context Details Panel** - In your screenshot, you can see the "Context details" showing what LaunchDarkly sees
5. **Test Multiple Users** - Use your ProfileSwitcher to verify rules work as expected

---

## Debugging

If your rule isn't working:

1. Check the **Context details** panel in LaunchDarkly (your screenshot shows this)
2. Verify the attribute names match exactly (case-sensitive!)
3. Remove individual targets that might be overriding your rule
4. Check rule order - a rule above might be catching first
5. Use the **Evaluations** tab to see why a user got a specific variation

Happy targeting! 🎯
