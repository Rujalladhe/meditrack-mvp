import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define Schemas inline to avoid import issues in standalone script
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'pharmacist', 'user'], default: 'user' },
    isApproved: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

const PharmacySchema = new mongoose.Schema({
    name: { type: String, required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    contactNumber: { type: String, required: true },
});

const MedicineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brandName: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'unisex'], default: 'unisex' },
    ageGroup: { type: String, required: true },
    discount: { type: Number, default: 0 },
    pharmacyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Pharmacy = mongoose.models.Pharmacy || mongoose.model('Pharmacy', PharmacySchema);
const Medicine = mongoose.models.Medicine || mongoose.model('Medicine', MedicineSchema);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/meditrack-mvp';

async function seedData() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // 1. Setup Admin
        const adminEmail = 'admin@meditrack.com';
        const adminHashedPassword = await bcrypt.hash('admin123', 10);

        await User.findOneAndUpdate(
            { email: adminEmail },
            {
                name: 'Admin User',
                password: adminHashedPassword,
                role: 'admin',
                isApproved: true
            },
            { upsert: true, new: true }
        );
        console.log('✅ Admin set up: admin@meditrack.com / admin123');

        // 2. Setup Pharmacists and Pharmacies
        const locations = [
            {
                name: 'Mumbai Central Pharmacy',
                address: 'Dadar West, Mumbai, Maharashtra 400028',
                lat: 19.0178,
                lng: 72.8478,
                email: 'mumbai@meditrack.com',
                pharmacistName: 'Amit Sharma'
            },
            {
                name: 'Pune Wellness Center',
                address: 'Kothrud, Pune, Maharashtra 411038',
                lat: 18.5074,
                lng: 73.8077,
                email: 'pune@meditrack.com',
                pharmacistName: 'Rahul Deshmukh'
            },
            {
                name: 'Nagpur Medico',
                address: 'Sitabuldi, Nagpur, Maharashtra 440012',
                lat: 21.1458,
                lng: 79.0882,
                email: 'nagpur@meditrack.com',
                pharmacistName: 'Sanjay Patil'
            },
            {
                name: 'Bangalore Health Plus',
                address: 'Indiranagar, Bangalore, Karnataka 560038',
                lat: 12.9784,
                lng: 77.6408,
                email: 'bangalore@meditrack.com',
                pharmacistName: 'Vikram Reddy'
            }
        ];

        const pharmacistPass = await bcrypt.hash('pharmacist123', 10);

        for (const loc of locations) {
            const pharmacist = await User.findOneAndUpdate(
                { email: loc.email },
                {
                    name: loc.pharmacistName,
                    password: pharmacistPass,
                    role: 'pharmacist',
                    isApproved: true
                },
                { upsert: true, new: true }
            );

            const pharmacy = await Pharmacy.findOneAndUpdate(
                { ownerId: pharmacist._id },
                {
                    name: loc.name,
                    address: loc.address,
                    latitude: loc.lat,
                    longitude: loc.lng,
                    contactNumber: '022-24301234'
                },
                { upsert: true, new: true }
            );

            // 4. Setup Medicines for each pharmacy
            const medicinesData = [
                {
                    name: 'Paracetamol',
                    brandName: 'Crocin',
                    price: 30,
                    quantity: 150,
                    expiryDate: new Date('2026-12-31'),
                    gender: 'unisex',
                    ageGroup: 'All ages',
                    discount: 5,
                    pharmacyId: pharmacy._id
                },
                {
                    name: 'Amoxicillin',
                    brandName: 'Novamox',
                    price: 120,
                    quantity: 60,
                    expiryDate: new Date('2025-06-30'),
                    gender: 'unisex',
                    ageGroup: 'Adults',
                    discount: 10,
                    pharmacyId: pharmacy._id
                },
                {
                    name: 'Cough Syrup',
                    brandName: 'Ascoril',
                    price: 95,
                    quantity: 40,
                    expiryDate: new Date('2025-09-15'),
                    gender: 'unisex',
                    ageGroup: 'Adults/Children',
                    discount: 0,
                    pharmacyId: pharmacy._id
                },
                {
                    name: 'Vitamin D3',
                    brandName: 'Uprise-D3',
                    price: 250,
                    quantity: 80,
                    expiryDate: new Date('2027-01-01'),
                    gender: 'unisex',
                    ageGroup: 'All ages',
                    discount: 15,
                    pharmacyId: pharmacy._id
                },
                {
                    name: 'Omeprazole',
                    brandName: 'Omez',
                    price: 55,
                    quantity: 200,
                    expiryDate: new Date('2026-08-20'),
                    gender: 'unisex',
                    ageGroup: 'Adults',
                    discount: 0,
                    pharmacyId: pharmacy._id
                }
            ];

            await Medicine.deleteMany({ pharmacyId: pharmacy._id });
            await Medicine.insertMany(medicinesData);
            console.log(`✅ Pharmacy and medicines set up for: ${loc.name}`);
        }

        console.log('\nSeed complete! Locations set in Maharashtra (Mumbai, Pune, Nagpur).');
        console.log('Admin: admin@meditrack.com / admin123');
        console.log('Sample Pharmacist: mumbai@meditrack.com / pharmacist123');

        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
}

seedData();

