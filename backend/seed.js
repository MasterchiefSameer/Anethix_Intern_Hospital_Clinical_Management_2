/**
 * Database Seeder Script.
 * Initializes the database with the very first Super Admin account.
 * Run using: `npm run seed` or `node seed.js` in the backend directory.
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

const seedDatabase = async () => {
    try {
        console.log('Connecting to MongoDB database...');
        await connectDB();

        // Define Super Admin default credentials
        const superAdminEmail = 'admin@medtrust.org';
        const superAdminPassword = 'Admin@12345';

        // Check if a Super Admin already exists
        const existingAdmin = await User.findOne({ email: superAdminEmail });

        if (existingAdmin) {
            console.log('\n======================================================');
            console.log('ℹ️  Super Admin account already exists in the database:');
            console.log(`   Email:    ${existingAdmin.email}`);
            console.log(`   Role:     ${existingAdmin.role}`);
            console.log(`   Name:     ${existingAdmin.name}`);
            console.log('======================================================\n');
        } else {
            // Create the first Super Admin account
            // Note: password gets hashed automatically by User schema pre('save') hook
            const superAdmin = await User.create({
                name: 'MedTrust Super Admin',
                email: superAdminEmail,
                password: superAdminPassword,
                role: 'Super Admin',
                phone: '9811122334',
                gender: 'Male',
                bloodGroup: 'O+',
                address: 'MedTrust Headquarters, Central Wing',
                city: 'New Delhi',
                state: 'Delhi',
                pincode: '110016',
                languages: 'English, Hindi',
                isFirstLogin: false,
                isActive: true,
            });

            console.log('\n======================================================');
            console.log('🎉 Super Admin account created successfully!');
            console.log('------------------------------------------------------');
            console.log(`   Email:    ${superAdmin.email}`);
            console.log(`   Password: ${superAdminPassword}`);
            console.log(`   Role:     ${superAdmin.role}`);
            console.log(`   ID:       ${superAdmin._id}`);
            console.log('======================================================\n');
        }

        console.log('Seed process completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error(`\n❌ Error during database seeding: ${error.message}`);
        process.exit(1);
    }
};

seedDatabase();
