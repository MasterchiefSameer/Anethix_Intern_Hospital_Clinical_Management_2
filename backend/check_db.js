import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({path: './.env'});

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const User = (await import('./models/User.js')).default;
    const patients = await User.find({ role: 'Patient' });
    console.log("Total Patients found:", patients.length);
    if(patients.length > 0) {
        console.log("Sample Patient:", patients[0].name, "| Role:", patients[0].role);
    }
    const allUsers = await User.find({}, 'name role');
    console.log("\nAll Roles in DB:", [...new Set(allUsers.map(u => u.role))]);
    process.exit(0);
}).catch(console.error);
