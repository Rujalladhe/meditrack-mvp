# 🚀 AI Symptom Checker - Quick Start

## ⚡ 3 Steps to Get Started

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Seed the Database
```bash
npm run seed:medicines
```

**Note:** If you get a MongoDB connection error, make sure:
- Your MongoDB connection string in `.env.local` is correct
- Your IP is whitelisted in MongoDB Atlas
- Your internet connection is stable

### Step 3: Start the App
```bash
npm run dev
```

Then visit: **http://localhost:3001/symptom-checker**

---

## 🎯 Quick Test

Try these example queries:

1. **"I have a headache and fever"**
2. **"I can't sleep"**
3. **"My nose is stuffy"**
4. **"I have heartburn"**
5. **"I have an itchy rash"**

---

## 📍 Where to Find It

### In the App:
- **Homepage Navigation:** Click "AI Symptom Checker" in the top menu
- **Hero Section:** Click "Try AI Symptom Checker" button
- **Direct URL:** `/symptom-checker`

---

## 🔑 What's Already Configured

✅ Groq API Key (in `.env.local`)  
✅ Llama 3.3 70B model  
✅ 15+ medicines with full medical data  
✅ 4 sample pharmacies  
✅ Beautiful chat UI  
✅ Location-based pharmacy search  
✅ Alternative medicine suggestions  

---

## 🎨 Features You Get

### AI Chat
- Natural language symptom input
- Conversational interface
- Message history
- Typing indicators

### Medicine Info
- Brand & generic names
- Dosage instructions
- Side effects
- Precautions
- Timing details
- Price & stock

### Pharmacy Locator
- Distance calculation
- Sorted by proximity
- Contact information
- Stock availability
- Interactive cards

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check your .env.local file
# Make sure MONGODB_URI is correct
# Whitelist your IP in MongoDB Atlas
```

### Seed Script Fails
```bash
# Install dependencies first
npm install

# Then try seeding again
npm run seed:medicines
```

### AI Not Responding
```bash
# Check if GROQ_API_KEY is in .env.local
# Verify the API key is valid
# Check console for errors
```

### Location Not Working
- Allow location access in browser
- App works without location (just won't show distances)
- Check browser console for permission errors

---

## 📚 Documentation

- **Full Setup Guide:** `AI_SYMPTOM_CHECKER_SETUP.md`
- **Feature Details:** `FEATURE_SUMMARY.md`
- **This Guide:** `QUICK_START.md`

---

## 💡 Pro Tips

1. **Allow location access** for best experience (shows nearest pharmacies)
2. **Be specific** with symptoms for better recommendations
3. **Ask follow-up questions** - the AI maintains conversation context
4. **Check alternatives** if a medicine is out of stock
5. **Read all precautions** before using any medicine

---

## 🎉 You're Ready!

The AI Symptom Checker is fully integrated and ready to use. Enjoy exploring the feature!

**Questions?** Check the detailed documentation files or the code comments.
