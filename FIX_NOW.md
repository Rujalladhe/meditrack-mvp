# ⚡ QUICK FIX - MongoDB Connection Error

## 🎯 The Problem
Your symptom checker can't connect to MongoDB Atlas.

## ✅ The Solution (2 minutes)

### Step 1: Go to MongoDB Atlas
**Visit:** https://cloud.mongodb.com/

### Step 2: Click "Network Access"
Look for it in the left sidebar menu.

### Step 3: Click "Add IP Address"
Big green button on the right.

### Step 4: Click "Add Current IP Address"
This automatically adds your current IP.

### Step 5: Click "Confirm"
Wait 1-2 minutes for changes to apply.

### Step 6: Restart Your Server
```bash
# Stop the server (Ctrl+C)
# Then start again:
npm run dev
```

### Step 7: Test Again
Visit: http://localhost:3001/symptom-checker
Type: "I have a headache"

---

## 🎉 Done!

If it works, you should see:
- AI responds with medicine recommendations
- Medicine cards appear
- Pharmacy locations shown

---

## 🔄 Alternative: Allow All IPs (Quick Test)

If you just want to test quickly:

1. MongoDB Atlas → Network Access
2. Add IP Address
3. **Allow Access from Anywhere**
4. Confirm

⚠️ **Note:** This is less secure, only for testing!

---

## 📝 After It Works

Run the seed script to add medicines:
```bash
npm run seed:medicines
```

---

## 🆘 Still Not Working?

Check the detailed guide: **MONGODB_FIX.md**

Or verify your connection string in `.env.local`:
```env
MONGODB_URI=mongodb+srv://rujalladhe21_db_user:NxTOq3toUmUWbMdR@cluster0.3g5cddv.mongodb.net/?appName=Cluster0
```

---

**Most likely fix:** Just whitelist your IP! 🎯
