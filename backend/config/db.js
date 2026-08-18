/**
 * This file contains the MongoDB database connection logic.
 * It uses Mongoose to connect to the database specified in the MONGO_URI environment variable.
 */
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
