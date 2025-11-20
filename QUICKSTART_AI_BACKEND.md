# Quick Start Guide: Real AI Backend

## ✅ Step 1: Get Your API Keys

### OpenAI API Key
1. Go to https://platform.openai.com/signup
2. Sign up (you get $5 free credit!)
3. Go to https://platform.openai.com/api-keys
4. Click "Create new secret key"
5. **Copy the key** (starts with `sk-...`)

### LaunchDarkly Server SDK Key
1. Go to LaunchDarkly → Account Settings
2. Click your project → Environments
3. Click "Test" or "Production"
4. Copy the **"SDK key"** (starts with `sdk-...`)  
   ⚠️ **NOT** the "Client-side ID"!

---

## ✅ Step 2: Configure Backend

```bash
cd backend
```

Edit `.env` file:
```env
LD_SDK_KEY=sdk-paste-your-key-here
OPENAI_API_KEY=sk-paste-your-key-here
PORT=3001
```

---

## ✅ Step 3: Install & Start Backend

```bash
# Install dependencies
npm install

# Start the server
npm start
```

You should see:
```
✅ LaunchDarkly SDK initialized
🚀 Backend server running on http://localhost:3001
```

---

## ✅ Step 4: Test Backend

Open browser to: http://localhost:3001/health

Should show:
```json
{
  "status": "ok",
  "message": "LaunchDarkly AI Backend is running",
  "ldReady": true
}
```

---

## ✅ Step 5: Start Frontend

**Open a new terminal** (keep backend running!)

```bash
cd ..  # Back to main project folder
npm run dev
```

---

## ✅ Step 6: Test the AI Assistant

1. Open http://localhost:5173
2. Click "🤖 Ask AI" button
3. Click any quick question
4. **Real AI response will appear!** 🎉

---

## ✅ Step 7: Configure LaunchDarkly AI Config

### Option 1: Use Existing AI Config

Your `ai-pricing-assistant` AI Config is already set up!

The backend will read:
- Model from AI Config
- System prompt from messages
- Temperature, max tokens, etc.

### Option 2: Test with Different Variations

Create variations in LaunchDarkly:

**Friendly Helper:**
- Model: gpt-3.5-turbo
- System prompt: "You are a friendly, enthusiastic pricing assistant..."

**Professional Consultant:**
- Model: gpt-4 (costs more but better quality!)
- System prompt: "You are a professional pricing consultant..."

---

## 🎯 Demo Flow

1. **Switch users** in the ProfileSwitcher
2. **Create targeting rules** in LaunchDarkly:
   - Enterprise users → GPT-4 (better quality)
   - Basic users → GPT-3.5-turbo (cheaper)
3. **Ask questions** and see real AI responses
4. **Switch flag variations** to change AI personality instantly!

---

## 💰 Cost Monitoring

Check usage at: https://platform.openai.com/usage

Typical costs per response:
- GPT-3.5-turbo: ~$0.001 (1/10 of a cent)
- GPT-4: ~$0.03 (3 cents)

Your $5 credit = ~5,000 GPT-3.5 responses or ~150 GPT-4 responses

---

## ❌ Troubleshooting

### "Failed to get AI response"
- ✅ Is backend running? Check terminal
- ✅ Check http://localhost:3001/health
- ✅ Check browser console for errors

### "LaunchDarkly SDK not initialized"
- ✅ Is `LD_SDK_KEY` correct in `.env`?
- ✅ Did you use **server-side** SDK key (not client ID)?

### "OpenAI API error"
- ✅ Is `OPENAI_API_KEY` correct?
- ✅ Do you have credits? Check platform.openai.com
- ✅ Did you add payment info to OpenAI?

### Backend won't start
- ✅ Run `npm install` in backend folder
- ✅ Check Node.js version (need v18+)

---

## 🚀 What You Just Built!

✅ Real AI integration with OpenAI  
✅ LaunchDarkly AI Config controls everything  
✅ Different AI models/prompts for different users  
✅ Secure - API keys never exposed to frontend  
✅ A/B test different AI personalities  
✅ Dynamic targeting by user role/region  

This is a production-ready architecture! 🎉
