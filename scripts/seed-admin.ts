import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/meditrack-mvp';

async function seedAdmin() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@meditrack.com' });

        if (existingAdmin) {
            console.log('⚠️  Admin user already exists with email: admin@meditrack.com');
            console.log('Updating password to: admin123');

            const hashedPassword = await bcrypt.hash('admin123', 10);
            existingAdmin.password = hashedPassword;
            existingAdmin.role = 'admin'; // Ensure role is correct
            existingAdmin.isApproved = true; // Ensure isApproved is accurate
            await existingAdmin.save();

            console.log('✅ Admin password updated successfully!');
            console.log('Email: admin@meditrack.com');
            console.log('Password: admin123');
            console.log('\nYou can now login at: http://localhost:3000/login');

            await mongoose.connection.close();
            return;
        }

        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);

        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@meditrack.com',
            password: hashedPassword,
            role: 'admin',
            isApproved: true,
        });

        console.log('✅ Admin user created successfully!');
        console.log('Email: admin@meditrack.com');
        console.log('Password: admin123');
        console.log('\n⚠️  IMPORTANT: Please change the password after first login!');
        console.log('\nYou can now login at: http://localhost:3000/login');

        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error seeding admin user:', error);
        process.exit(1);
    }
}

seedAdmin();
