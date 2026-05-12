import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db/database.js';

dotenv.config({
    path: './.env'
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.on('error', (error) => {
            throw error;
        });

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Server startup failed:', error.message);
        process.exit(1);
    }
};

startServer();
