# Setup Guide

## Prerequisites
- Node.js 18+
- LaunchDarkly account (free trial available)
- OpenAI API key (optional, only for AI features)

## 1. Install Dependencies

```bash
# Frontend dependencies
npm install

# Backend dependencies (optional - only if using AI features)
cd backend && npm install && cd ..
```

## 2. Configure Environment Variables

### Frontend Environment File
Create `.env.local` in the project root:

```bash
VITE_LD_CLIENT_SIDE_ID=your-launchdarkly-client-side-id
```

**Where to find:** LaunchDarkly → Projects → Your Project → Environments → SDK keys → Client-side ID

### Backend Environment File (Optional - AI Features Only)
Create `backend/.env`:

```bash
LD_SDK_KEY=your-launchdarkly-server-sdk-key
OPENAI_API_KEY=your-openai-api-key
PORT=3001
```

**Where to find:** 
- LaunchDarkly Server SDK Key: Projects → Your Project → Environments → SDK keys → Server-side SDK key
- OpenAI API Key: platform.openai.com → API keys

## 3. Run the Application

### Option A: Frontend Only (No AI Features)
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

### Option B: Full Stack (With AI Features)
Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 4. Create Feature Flags in LaunchDarkly

### Required Flag
1. Go to LaunchDarkly → Flags → Create Flag
2. **Key:** `new-pricing-calculator`
3. **Type:** Boolean
4. **Default:** `false`
5. Click "Save flag"

### Optional Flags
- `thirty-day-free-trial` (Boolean) - Shows free trial button in header
- `ai-pricing-assistant` (AI Config) - Controls AI assistant personality (requires backend)

## Verify Setup

✅ Frontend loads at http://localhost:5173  
✅ You see "Feature Flagged Pricing Demo" header  
✅ Flag Status shows 🔴 OFF (or 🟢 ON if you enabled it)  
✅ User profile switcher dropdown works  
✅ (Optional) Backend health check: http://localhost:3001/health  

## Troubleshooting

**Flag shows undefined:**
- Check `.env.local` has correct `VITE_LD_CLIENT_SIDE_ID`
- Restart dev server after changing `.env.local`
- Verify flag exists in LaunchDarkly with exact key name

**Backend won't start:**
- Check `backend/.env` has correct keys
- Ensure OpenAI API key is valid and has credits
- Check terminal for specific error messages

**Changes don't appear:**
- Hard refresh browser (Cmd+Shift+R or Ctrl+F5)
- Check LaunchDarkly flag is published (not draft)
