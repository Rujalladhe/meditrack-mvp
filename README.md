# MediTrack MVP 🏥

**MediTrack** is a modern, real-time medicine discovery and pharmacy management platform. It bridges the gap between patients and pharmacies by providing live stock tracking and location-based search.

---

## 🛠 Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS v4, Framer Motion (Animations)
- **Backend**: Next.js API Routes (Serverless)
- **Database**: MongoDB (via Mongoose ODM)
- **Authentication**: NextAuth.js
- **Maps**: Leaflet.js with CartoDB Dark Mode tiles
- **Icons**: Lucide React

---

## 🎓 Viva Questions & Answers (Student Guide)

### 1. General Product Questions
**Q: What problem does MediTrack solve?**  
**A:** It solves the problem of "Medicine Unavailability." Users often have to visit multiple pharmacies to find a specific medicine. MediTrack allows them to check live stock and prices at nearby pharmacies from their phone.

**Q: Who are the primary users of this system?**  
**A:** There are 3 roles:
1. **Users/Patients**: Search for medicines and get directions.
2. **Pharmacists**: Manage their medicine inventory and store profile.
3. **Admins**: Approve new pharmacists and monitor platform health.

**Q: How does the "Nearby Search" work?**  
**A:** We use the browser's Geolocation API to get the user's coordinates and then calculate the distance to various pharmacies stored in our database using the Haversine formula.

---

### 2. Technical / Implementation Questions
**Q: Why did you choose Next.js instead of plain React?**  
**A:** Next.js provides Full-Stack capabilities (API routes), optimized performance (Server Components), and better SEO out of the box. It simplifies building a production-ready app.

**Q: How is the authentication handled?**  
**A:** We use **NextAuth.js**. It manages secure session handling, password hashing (using bcrypt), and provides a flexible way to handle different user roles (Admin vs. Pharmacist).

**Q: What database are you using and why?**  
**A:** **MongoDB**. As a NoSQL database, it's great for healthcare data where medicine details might vary. It’s also very easy to scale and works perfectly with JSON-like documents in Node.js.

**Q: How are you showing the map?**  
**A:** We use **Leaflet.js**, an open-source mapping library. We also used **CartoDB Dark Matter** tiles to give the map a premium dark-mode aesthetic.

---

### 3. Feature-Specific Questions
**Q: How does the pharmacist update inventory?**  
**A:** Once logged in, pharmacists have a dedicated dashboard where they can add, edit, or delete medicines. These changes are reflected instantly in the user's search results.

**Q: What is the significance of the "Admin Approval" feature?**  
**A:** To prevent fake listings, only an Admin can approve a Pharmacist's account. This ensures that the data on the platform is verified and trustworthy.

**Q: What animations are used to make the UI look premium?**  
**A:** We used **Framer Motion** for smooth entrances, hover effects on cards, and **glassmorphism** (translucent backgrounds) in the CSS to follow modern design trends.

---

## 🚀 Key Features
- **Real-time Search**: Instant filtering of medications by name.
- **Smart Mapping**: Dark-mode map with custom markers for users and stores.
- **Role-Based Access**: Secured routes for Users, Pharmacists, and Admins.
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop.
- **Inventory Metrics**: Pharmacists can see low-stock and expiry alerts.

---

## 🏃 How to Run Locally
1. Clone the repo
2. Run `npm install`
3. Set up your `.env.local` with `MONGODB_URI` and `NEXTAUTH_SECRET`
4. Run `npm run dev`
5. Visit `http://localhost:3000`
