const mongoose = require('mongoose');
const dns = require('dns');

// Fix Windows DNS SRV lookup issue for MongoDB Atlas cluster
try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
    // Ignore if not supported
}

const connectDB = async () => {
    try {
        const mongoUrl = process.env.MONGODB_URL || process.env.MONGO_URI || process.env.MONGODB_URI;
        if (!mongoUrl) {
            console.error('MONGODB_URL is missing in environment variables');
            return;
        }
        await mongoose.connect(mongoUrl, {
            dbName: 'movieapp'
        });
        console.log('Connected to MongoDB database');
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
    }
};

connectDB();

module.exports = mongoose;