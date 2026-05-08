# 🔧 MongoDB Connection Error - Quick Fix

## Error You're Seeing:
```
Error: querySrv ENOTFOUND _mongodb._tcp.cluster0.3g5cddv.mongodb.net
```

## 🎯 Solution: Whitelist Your IP in MongoDB Atlas

### Step 1: Go to MongoDB Atlas
1. Visit: https://cloud.mongodb.com/
2. Log in with your credentials
3. Select your project (the one with cluster0.3g5cddv)

### Step 2: Add Your IP Address
1. Click **"Network Access"** in the left sidebar
2. Click **"Add IP Address"** button
3. Choose one of these options:

   **Option A: Add Current IP (Recommended for Development)**
   - Click "Add Current IP Address"
   - Click "Confirm"
   
   **Option B: Allow Access from Anywhere (Quick Test Only)**
   - Click "Allow Access from Anywhere"
   - This adds `0.0.0.0/0` (not recommended for production)
   - Click "Confirm"

### Step 3: Wait for Changes to Apply
- MongoDB Atlas takes 1-2 minutes to apply the changes
- You'll see a green status indicator when ready

### Step 4: Test Again
```bash
# Restart your dev server
# Press Ctrl+C to stop
npm run dev

# Then try the symptom checker again
```

---

## 🔍 Alternative: Check Your Connection String

If whitelisting doesn't work, verify your connection string:

### Current Connection String:
```
mongodb+srv://rujalladhe21_db_user:NxTOq3toUmUWbMdR@cluster0.3g5cddv.mongodb.net/?appName=Cluster0
```

### Verify:
1. **Username:** `rujalladhe21_db_user` ✓
2. **Password:** `NxTOq3toUmUWbMdR` ✓
3. **Cluster:** `cluster0.3g5cddv.mongodb.net` ✓

### Add Database Name (Optional):
```
mongodb+srv://rujalladhe21_db_user:NxTOq3toUmUWbMdR@cluster0.3g5cddv.mongodb.net/meditrack?appName=Cluster0
```

Update in `.env.local` if needed.

---

## 🧪 Test MongoDB Connection

Create a test file to verify connection:

```bash
# Create test file
cat > test-mongodb.js << 'EOF'
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://rujalladhe21_db_user:NxTOq3toUmUWbMdR@cluster0.3g5cddv.mongodb.net/?appName=Cluster0';

async function testConnection() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected successfully!');
    await mongoose.connection.close();
    console.log('Connection closed.');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();
EOF

# Run test
node test-mongodb.js
```

---

## 🚀 Quick Workaround: Use Local MongoDB (Optional)

If you want to test without MongoDB Atlas:

### Install MongoDB Locally:
```bash
# Windows (using Chocolatey)
choco install mongodb

# Or download from: https://www.mongodb.com/try/download/community
```

### Update .env.local:
```env
MONGODB_URI=mongodb://localhost:27017/meditrack
```

### Start MongoDB:
```bash
mongod
```

---

## 📊 Check MongoDB Atlas Status

1. Go to your cluster in MongoDB Atlas
2. Check if cluster is **Active** (green status)
3. Check if there are any alerts or issues
4. Verify your subscription is active

---

## 🔐 Check Database User Permissions

1. In MongoDB Atlas, go to **"Database Access"**
2. Find user: `rujalladhe21_db_user`
3. Verify permissions:
   - ✅ Should have "Read and write to any database"
   - ✅ Or at least read/write to your specific database

---

## 🌐 Check Internet Connection

```bash
# Test DNS resolution
nslookup cluster0.3g5cddv.mongodb.net

# Test connectivity
ping cluster0.3g5cddv.mongodb.net
```

---

## ✅ After Fixing

Once MongoDB connection works:

1. **Seed the database:**
   ```bash
   npm run seed:medicines
   ```

2. **Restart dev server:**
   ```bash
   npm run dev
   ```

3. **Test symptom checker:**
   - Visit: http://localhost:3001/symptom-checker
   - Type: "I have a headache"
   - Should get AI response with medicine recommendations

---

## 🆘 Still Not Working?

### Check These:
- [ ] IP whitelisted in MongoDB Atlas
- [ ] Cluster is active and running
- [ ] Database user exists and has permissions
- [ ] Connection string is correct
- [ ] Internet connection is stable
- [ ] No firewall blocking MongoDB ports
- [ ] Dev server restarted after changes

### Get More Info:
```bash
# Check if MongoDB URI is loaded
node -e "require('dotenv').config({path:'.env.local'}); console.log(process.env.MONGODB_URI)"
```

---

## 💡 Pro Tip

For development, you can temporarily allow access from anywhere:
1. MongoDB Atlas → Network Access
2. Add IP: `0.0.0.0/0`
3. This allows all IPs (not secure for production!)
4. Remember to restrict it later

---

## 📞 Need More Help?

1. Check MongoDB Atlas documentation: https://docs.atlas.mongodb.com/
2. Check connection troubleshooting: https://docs.atlas.mongodb.com/troubleshoot-connection/
3. Verify your cluster is in the correct region
4. Check MongoDB Atlas status page for outages

---

**Most Common Fix:** Just whitelist your IP address in MongoDB Atlas Network Access! 🎯
