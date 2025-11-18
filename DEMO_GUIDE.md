# Individual Targeting Demo Guide

## What You Just Built

Your app now has a **ProfileSwitcher** that lets you change between different user profiles. This demonstrates LaunchDarkly's **Individual Targeting** feature.

## How It Works

### 1. User Profiles in Your App
The ProfileSwitcher includes 4 preset users:
- **Anonymous User** (guest) - `user-anonymous`
- **Sarah Chen** (enterprise) - `user-sarah`
- **John Smith** (basic) - `user-john`
- **Admin User** (admin) - `user-admin`

### 2. User Context Sent to LaunchDarkly
When you switch users, the app sends this data to LaunchDarkly:
```javascript
{
  key: 'user-sarah',        // Unique identifier
  name: 'Sarah Chen',       // Display name
  email: 'sarah@enterprise.com',
  custom: {
    role: 'enterprise'      // Custom attribute
  }
}
```

### 3. Setting Up Individual Targeting in LaunchDarkly UI

#### Step-by-Step:
1. Go to your **new-pricing-calculator** flag in LaunchDarkly
2. Look for the **"0 individual targets"** section (you see this in your screenshot)
3. Click **"Add or search contexts"**
4. In the dropdown, change **"user"** to match your context kind (should be "user")
5. Type one of your user keys, for example: `user-sarah`
6. Choose the variation to serve (true/false, or the yellow/blue circles)
7. Click **"Add"**
8. **Save your changes**

#### Example Targeting Rules:
- Set `user-sarah` → **true** (sees new pricing calculator)
- Set `user-john` → **false** (sees legacy pricing)
- Set `user-admin` → **true** (sees new pricing calculator)
- Leave `user-anonymous` without individual targeting (falls through to default rule)

## Testing Your Demo

1. **Start your dev server** (if not running):
   ```bash
   npm run dev
   ```

2. **In LaunchDarkly UI**: Set individual targeting for `user-sarah` → true

3. **In your app**: 
   - Select "Anonymous User" → Should see whatever your default rule serves
   - Select "Sarah Chen" → Should see the NEW pricing calculator (🟢 ON)
   - Select "John Smith" → Should see whatever the default rule serves (or set individual target to false)

4. **Watch the magic**: The flag status changes instantly when you switch users!

## Advanced: Rule-Based Targeting

You can also create rules based on user attributes:

### Example Rule:
"Show new calculator to users where `role = enterprise`"

1. In LaunchDarkly, click **"+ Add rule"** (the + button between individual targets and default rule)
2. Create a rule: `role` `is one of` `enterprise`
3. Set it to serve **true**
4. Save

Now Sarah Chen will see the new calculator because of the rule (even without individual targeting)!

## Key Concepts

- **Individual Targeting** = Highest priority, overrides all rules
- **Rules** = Evaluated top-to-bottom after individual targets
- **Default Rule** = Fallback when nothing else matches
- **User Key** = Must be unique identifier (like `user-sarah`, email, or user ID)

## Troubleshooting

- **Flag not changing?** Check the browser console for LaunchDarkly connection errors
- **"Flag Status: OFF" always?** Make sure your flag is ON in the LaunchDarkly UI
- **User not being targeted?** Make sure the user `key` in the code matches exactly what you typed in LaunchDarkly

Happy flagging! 🚀
