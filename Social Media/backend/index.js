const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/auth');
const noteRoute = require('./routes/user');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 8000;

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Use environment variable for frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoute);
app.use('/api/user', noteRoute);

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error("Error connecting to the database: " + err);
        process.exit(1);
    }
};

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, async () => {
    await connectDB();
    console.log("Server is running on port " + PORT);
});