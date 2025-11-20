# 🚀 Quick Reference Card

**For rapid demo setup and troubleshooting**

---

## ⚡ Start Demo (60 seconds)

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
npm run dev
```

**Open:** http://localhost:5173

---

## 🔑 Environment Setup

**Frontend** (`.env` in root):
```bash
VITE_LD_CLIENT_SIDE_ID=6916b19389126409bedcdeaf
```

**Backend** (`backend/.env`):
```bash
LD_SDK_KEY=sdk-xxxxx
OPENAI_API_KEY=sk-xxxxx
PORT=3001
```

---

## 🎯 LaunchDarkly Configuration

### Feature Flag
- **Key:** `newPricingCalculator`
- **Type:** Boolean
- **Variations:** ON (true), OFF (false)

### AI Config
- **Key:** `ai-pricing-assistant`
- **Type:** AI Config
- **Variations:**
  - `friendly-helper` (GPT-4, casual)
  - `professional-consultant` (GPT-4, formal)

### Users
| Key | Role | Region | Country |
|-----|------|--------|---------|
| user-anonymous | guest | US-West | USA |
| user-sarah | enterprise | US-East | USA |
| user-john | basic | EU-West | UK |
| user-admin | admin | APAC | Singapore |

---

## 🧪 Test Scenarios

### 1. Basic Toggle
- Go to LD UI → Toggle `newPricingCalculator`
- Watch page update (no refresh)

### 2. Individual Target
- Target: `user-anonymous` → OFF
- Watch: Anonymous user sees legacy

### 3. Rule-Based
- Rule: `country = "USA"` → ON
- Test: John (UK) = OFF, Sarah (USA) = ON

### 4. AI Personalities
- Anonymous → Friendly Helper
- Sarah → Professional Consultant
- Check backend logs for variation

---

## 🐛 Troubleshooting

### Flag undefined
```bash
# Check browser console
# Verify flag exists in LD UI
# Confirm clientSideID is correct
```

### Backend won't start
```bash
# Check .env file exists
# Verify LD_SDK_KEY starts with "sdk-"
# Ensure OpenAI key is valid
npm install  # Reinstall dependencies
```

### AI not working
```bash
# Terminal 1: Check backend logs
# Look for "✅ LaunchDarkly SDK initialized"
# Verify "🎭 Variation: friendly-helper"

# Terminal 2: Browser console
# Look for "🤖 AI Response Metadata"
```

### CORS error
```bash
# Backend must be on port 3001
# Frontend must be on port 5173
# Restart both servers
```

---

## 📍 Key Files

```
README.md ← Overview
DEMO_SCRIPT.md ← Interview flow
INTERVIEW_NOTES.md ← Technical details

src/
  App.tsx ← Feature flag usage
  ProfileSwitcher.tsx ← User switching
  AIAssistant.tsx ← AI chat

backend/
  server.js ← LaunchDarkly + OpenAI
```

---

## 🎤 Demo Flow (10 min)

1. **Feature Toggle** (2 min)
   - Show OFF state (legacy)
   - Toggle ON (new calculator)
   - Emphasize instant update

2. **Targeting** (4 min)
   - Individual: target user-anonymous
   - Rule: country = USA
   - Role: enterprise only

3. **Experimentation** (2 min)
   - Click "Contact Sales"
   - Show event tracking in console

4. **AI Configs** (4 min)
   - Test with Anonymous (friendly)
   - Switch to Sarah (professional)
   - Show backend logs

---

## 💬 Quick Answers

**"How long did this take?"**
> ~10 hours total (development + documentation)

**"What's the tech stack?"**
> React 18, TypeScript, Node.js, Express, OpenAI, LaunchDarkly

**"What's most impressive?"**
> Real-time AI prompt control without deployments + full-stack integration

**"Production ready?"**
> Core architecture yes; would add monitoring, rate limiting, caching for scale

**"Why LaunchDarkly?"**
> Real-time updates (SSE), native AI Configs, built-in experimentation, excellent DX

---

## 🔗 Quick Links

- LaunchDarkly Dashboard: https://app.launchdarkly.com
- OpenAI Platform: https://platform.openai.com
- Frontend: http://localhost:5173
- Backend Health: http://localhost:3001/health

---

**Print this page for your interview! 📄**
