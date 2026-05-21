import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGO_URI}`, {
            dbName: DB_NAME
        });
        console.log(`MongoDB connected: ${conn.connection.host} (db: ${DB_NAME})`);
    } catch (error) {
        console.error('Database connection error:', error.message);
        process.exit(1);
    }
};

export default connectDB;