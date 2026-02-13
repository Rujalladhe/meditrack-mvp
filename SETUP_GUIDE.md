# MediTrack MVP - Quick Setup Guide

## ✅ Project Created Successfully!

The MediTrack MVP application has been successfully built with all required features.

## 🚀 Current Status

- ✅ Next.js 14+ project initialized
- ✅ All dependencies installed
- ✅ Full-stack architecture implemented
- ✅ Database models created
- ✅ API routes configured
- ✅ Authentication system ready
- ✅ Dashboards built for all roles
- ✅ Map integration with Leaflet.js
- ✅ Development server running on `http://localhost:3000`

## 🔧 Next Steps to Use the Application

### 1. Set Up MongoDB

You have two options:

**Option A: Local MongoDB**
```bash
# Make sure MongoDB is installed and running
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at https://www.mongodb.com/atlas
2. Create a new cluster
3. Get your connection string
4. Update `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/meditrack-mvp
   ```

### 2. Update Environment Variables

Edit `meditrack-mvp/.env.local` and set a strong secret:

```bash
# Generate a secret (on Windows PowerShell):
# Use an online generator or create your own strong secret

NEXTAUTH_SECRET=your-generated-secret-here
```

### 3. Access the Application

The dev server is already running at: **http://localhost:3000**

### 4. Create Admin Account

#### Method 1: Register and Update via MongoDB
1. Go to http://localhost:3000/register
2. Register a new user with your email
3. Use MongoDB Compass/Atlas to update the user:
   - Change `role` to `"admin"`
   - Change `isApproved` to `true`

#### Method 2: Using MongoDB Shell
```javascript
// Connect to MongoDB
use meditrack-mvp

// Update your user to admin
db.users.updateOne(
  { email: "youremail@example.com" },
  { $set: { role: "admin", isApproved: true } }
)
```

## 📋 Testing the Application

### Test as User:
1. Register at `/register` with role "User"
2. Login and allow location access
3. Search for medicines (you'll need pharmacies to add medicines first)

### Test as Pharmacist:
1. Register at `/register` with role "Pharmacist"
2. Login as **admin** and approve the pharmacist
3. Logout and login as the pharmacist
4. Create pharmacy profile with location
5. Add medicines to inventory

### Test as Admin:
1. Login with admin account
2. Approve/reject pharmacist accounts
3. View and manage all pharmacies

## 🎯 Key URLs

- **Home**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Register**: http://localhost:3000/register
- **Dashboard**: http://localhost:3000/dashboard (redirects based on role)

## 🔍 File Structure

```
meditrack-mvp/
├── app/
│   ├── api/                    # API Routes
│   │   ├── auth/              # NextAuth
│   │   ├── register/          # User registration
│   │   ├── admin/approve/     # Pharmacist approval
│   │   ├── pharmacy/          # Pharmacy CRUD
│   │   ├── medicine/          # Medicine CRUD
│   │   └── search/            # Medicine search
│   ├── dashboard/             # Role-based dashboards
│   ├── login/                 # Login page
│   ├── register/              # Registration page
│   └── page.tsx               # Landing page
├── components/
│   ├── PharmacyMap.tsx        # Leaflet map
│   └── SessionProvider.tsx    # Auth wrapper
├── lib/
│   ├── auth.ts                # NextAuth config
│   ├── mongodb.ts             # DB connection
│   └── distance.ts            # Distance calculation
├── models/
│   ├── User.ts                # User schema
│   ├── Pharmacy.ts            # Pharmacy schema
│   └── Medicine.ts            # Medicine schema
└── .env.local                 # Environment config
```

## 💡 Important Notes

1. **MongoDB Required**: The app won't work without MongoDB connection
2. **Location Access**: Users must allow browser geolocation for search
3. **HTTPS for Production**: Geolocation requires HTTPS in production
4. **Admin Approval**: Pharmacists cannot login until approved by admin
5. **One Pharmacy per Pharmacist**: Each pharmacist can only create one pharmacy

## 🐛 Troubleshooting

### "MongoDB connection failed"
- Check MongoDB is running
- Verify connection string in `.env.local`
- For Atlas: whitelist your IP address

### "Unauthorized" on API calls
- Make sure you're logged in
- Check user role matches the required role
- For pharmacists, ensure you're approved

### Map not loading
- Leaflet CSS is imported in `globals.css`
- Map uses dynamic import to avoid SSR issues
- Check browser console for errors

### Styles not applying
- Restart dev server: `Ctrl+C` then `npm run dev`
- Clear browser cache
- Check if Tailwind is configured

## 📊 Features Implemented

### ✅ Authentication
- Role-based auth (Admin, Pharmacist, User)
- JWT session management
- Password hashing with bcryptjs
- Pharmacist approval workflow

### ✅ User Features
- Medicine search by name
- Location-based sorting
- Sort by distance, price, discount
- Interactive map with markers
- Get directions to pharmacies

### ✅ Pharmacist Features
- Create pharmacy profile
- Add/Edit/Delete medicines
- Manage inventory (stock, price, discount)
- Track expiry dates

### ✅ Admin Features
- Approve/reject pharmacists
- View all pharmacies
- Delete pharmacies
- Platform management

### ✅ Technical Features
- Haversine distance calculation
- Browser geolocation API
- Leaflet.js + OpenStreetMap
- MongoDB with Mongoose
- TypeScript throughout
- Tailwind CSS styling
- Responsive design

## 🚀 Build for Production

```bash
npm run build
npm start
```

Remember to update environment variables for production!

## 📝 Additional Information

For more detailed documentation, see `README.md` in the project directory.

---

**Application is now ready to use! 🎉**

Start testing at: **http://localhost:3000**
