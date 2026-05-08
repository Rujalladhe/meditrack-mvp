# 🔧 AI Symptom Checker - Troubleshooting Guide

## ⚡ MOST COMMON ISSUE: MongoDB Connection Error

### Error Message:
```
Error: querySrv ENOTFOUND _mongodb._tcp.cluster0.3g5cddv.mongodb.net
```

### Quick Fix (2 minutes):
1. Go to https://cloud.mongodb.com/
2. Click **"Network Access"** (left sidebar)
3. Click **"Add IP Address"**
4. Click **"Add Current IP Address"**
5. Click **"Confirm"**
6. Wait 1-2 minutes
7. Restart dev server: `npm run dev`
8. Test again!

**See detailed guide:** `FIX_NOW.md` or `MONGODB_FIX.md`

---

## Common Issues & Solutions

### 1. MongoDB Connection Errors

#### Error: `ENOTFOUND` or `querySrv ENOTFOUND`
```
Error: querySrv ENOTFOUND _mongodb._tcp.cluster0.3g5cddv.mongodb.net
```

**Solutions:**
- ✅ Check your internet connection
- ✅ Verify `MONGODB_URI` in `.env.local` is correct
- ✅ Whitelist your IP address in MongoDB Atlas:
  1. Go to MongoDB Atlas dashboard
  2. Click "Network Access"
  3. Click "Add IP Address"
  4. Add your current IP or use `0.0.0.0/0` for testing (not recommended for production)
- ✅ Check if MongoDB cluster is running
- ✅ Verify database user credentials

#### Error: `Authentication failed`
```
MongoServerError: Authentication failed
```

**Solutions:**
- ✅ Check username and password in `MONGODB_URI`
- ✅ Verify database user exists in MongoDB Atlas
- ✅ Check user has correct permissions (read/write)
- ✅ Password special characters might need URL encoding

---

### 2. Seed Script Issues

#### Error: `tsx is not recognized`
```
'tsx' is not recognized as an internal or external command
```

**Solution:**
```bash
npm install -D tsx
```

#### Error: `Cannot find module 'dotenv'`
```
Error: Cannot find module 'dotenv'
```

**Solution:**
```bash
npm install dotenv
```

#### Seed Script Runs But No Data
**Check:**
1. MongoDB connection successful?
2. Check console output for errors
3. Verify in MongoDB Atlas that collections were created
4. Run: `npm run seed:medicines` again

---

### 3. Groq AI API Issues

#### Error: `Failed to process request`
```
{ error: 'Failed to process request' }
```

**Solutions:**
- ✅ Check `GROQ_API_KEY` in `.env.local`
- ✅ Verify API key is valid (not expired)
- ✅ Check Groq API status: https://console.groq.com/
- ✅ Check rate limits (free tier has limits)
- ✅ Verify internet connection

#### AI Returns Empty Response
**Solutions:**
- ✅ Check browser console for errors
- ✅ Verify API endpoint is running
- ✅ Check if medicines are in database
- ✅ Try a simpler query first
- ✅ Check Groq API logs in console

#### Rate Limit Exceeded
```
Error: Rate limit exceeded
```

**Solutions:**
- ✅ Wait a few minutes and try again
- ✅ Upgrade Groq API plan if needed
- ✅ Implement request throttling
- ✅ Cache common responses

---

### 4. Location Issues

#### Location Not Detected
**Solutions:**
- ✅ Allow location permission in browser
- ✅ Check browser console for permission errors
- ✅ Try HTTPS (some browsers require it)
- ✅ Check if browser supports Geolocation API
- ✅ App works without location (just won't show distances)

#### Distances Not Showing
**Solutions:**
- ✅ Verify location permission granted
- ✅ Check `userLocation` is sent in API request
- ✅ Verify pharmacies have latitude/longitude
- ✅ Check distance calculation function

---

### 5. UI/Display Issues

#### Chat Not Scrolling
**Solutions:**
- ✅ Check `messagesEndRef` is properly set
- ✅ Verify `scrollIntoView` is called
- ✅ Check CSS overflow properties
- ✅ Try refreshing the page

#### Medicine Cards Not Showing
**Solutions:**
- ✅ Check if `mentionedMedicines` array has data
- ✅ Verify AI response mentions medicine names
- ✅ Check medicine name matching logic
- ✅ Look for console errors

#### Pharmacy Cards Not Showing
**Solutions:**
- ✅ Verify location is provided
- ✅ Check if medicines are mentioned
- ✅ Verify pharmacies exist in database
- ✅ Check `nearbyPharmacies` array in response

#### Loading Indicator Stuck
**Solutions:**
- ✅ Check for API errors in console
- ✅ Verify `setLoading(false)` is called in finally block
- ✅ Check network tab for failed requests
- ✅ Refresh the page

---

### 6. Development Server Issues

#### Port Already in Use
```
Error: Port 3001 is already in use
```

**Solutions:**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Or change port in package.json
"dev": "next dev -p 3002"
```

#### Hot Reload Not Working
**Solutions:**
- ✅ Restart dev server
- ✅ Clear `.next` folder: `rm -rf .next`
- ✅ Check file watcher limits (Linux)
- ✅ Try hard refresh: Ctrl+Shift+R

---

### 7. Build/Production Issues

#### Build Fails
```
Error: Build failed
```

**Solutions:**
- ✅ Check TypeScript errors: `npm run lint`
- ✅ Verify all imports are correct
- ✅ Check environment variables are set
- ✅ Clear `.next` folder and rebuild

#### API Routes Not Working in Production
**Solutions:**
- ✅ Verify API routes are in `app/api/` folder
- ✅ Check `route.ts` naming (not `route.tsx`)
- ✅ Verify environment variables in production
- ✅ Check deployment logs

---

### 8. Data Issues

#### No Medicines in Database
**Solutions:**
```bash
# Re-run seed script
npm run seed:medicines

# Or manually check MongoDB
# Connect to MongoDB Atlas and verify collections
```

#### Medicines Not Updating
**Solutions:**
- ✅ Check if seed script completed successfully
- ✅ Verify MongoDB connection
- ✅ Clear cache and restart server
- ✅ Check for duplicate entries

#### Pharmacy Data Missing
**Solutions:**
- ✅ Verify pharmacies were created in seed script
- ✅ Check `populate('pharmacyId')` in API
- ✅ Verify pharmacy references are correct
- ✅ Re-run seed script

---

## Debugging Tips

### Enable Detailed Logging

**API Route (`app/api/ai-symptom-checker/route.ts`):**
```typescript
console.log('Request body:', body);
console.log('Medicines found:', medicines.length);
console.log('AI Response:', aiResponse);
console.log('Mentioned medicines:', mentionedMedicines.length);
```

**Frontend (`app/symptom-checker/page.tsx`):**
```typescript
console.log('Sending message:', userMessage);
console.log('API Response:', data);
console.log('User location:', userLocation);
```

### Check Browser Console
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for errors (red text)
4. Check Network tab for failed requests

### Check Server Logs
1. Look at terminal where `npm run dev` is running
2. Check for error messages
3. Verify API calls are being received

### Verify Database
1. Go to MongoDB Atlas
2. Browse Collections
3. Check Medicine and Pharmacy collections
4. Verify data exists and is correct

---

## Testing Checklist

### Before Reporting an Issue:

- [ ] Ran `npm install`
- [ ] Ran `npm run seed:medicines` successfully
- [ ] `.env.local` has all required variables
- [ ] MongoDB connection works
- [ ] Groq API key is valid
- [ ] Dev server is running (`npm run dev`)
- [ ] Checked browser console for errors
- [ ] Checked server logs for errors
- [ ] Tried refreshing the page
- [ ] Tried a different browser
- [ ] Cleared browser cache

---

## Quick Fixes

### Reset Everything
```bash
# Stop dev server (Ctrl+C)

# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next

# Re-seed database
npm run seed:medicines

# Start fresh
npm run dev
```

### Verify Installation
```bash
# Check Node version (should be 18+)
node --version

# Check npm version
npm --version

# Check if all dependencies installed
npm list --depth=0
```

### Test API Directly
```bash
# Using curl (replace with your actual data)
curl -X POST http://localhost:3001/api/ai-symptom-checker \
  -H "Content-Type: application/json" \
  -d '{"message":"I have a headache"}'
```

---

## Still Having Issues?

### Check These Files:
1. `.env.local` - Environment variables
2. `package.json` - Dependencies
3. `next.config.ts` - Next.js configuration
4. `tsconfig.json` - TypeScript configuration

### Verify These Endpoints:
- Homepage: `http://localhost:3001/`
- Symptom Checker: `http://localhost:3001/symptom-checker`
- API: `http://localhost:3001/api/ai-symptom-checker`

### Common Environment Variables:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
GROQ_API_KEY=gsk_...
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-key
```

---

## Getting Help

If you're still stuck:

1. **Check Documentation:**
   - `AI_SYMPTOM_CHECKER_SETUP.md`
   - `FEATURE_SUMMARY.md`
   - `ARCHITECTURE.md`

2. **Review Code:**
   - API: `app/api/ai-symptom-checker/route.ts`
   - Frontend: `app/symptom-checker/page.tsx`
   - Seed: `scripts/seed-medicines.ts`

3. **Check External Services:**
   - MongoDB Atlas: https://cloud.mongodb.com/
   - Groq Console: https://console.groq.com/

4. **Common Resources:**
   - Next.js Docs: https://nextjs.org/docs
   - Groq Docs: https://console.groq.com/docs
   - MongoDB Docs: https://docs.mongodb.com/

---

## Error Code Reference

| Error Code | Meaning | Solution |
|------------|---------|----------|
| ENOTFOUND | DNS lookup failed | Check internet, MongoDB URI |
| ECONNREFUSED | Connection refused | Check if service is running |
| 401 | Unauthorized | Check API key |
| 404 | Not found | Check URL/route |
| 500 | Server error | Check server logs |
| MODULE_NOT_FOUND | Missing dependency | Run `npm install` |

---

Remember: Most issues can be solved by:
1. Checking environment variables
2. Verifying database connection
3. Re-running seed script
4. Restarting dev server
5. Clearing cache

Good luck! 🚀
