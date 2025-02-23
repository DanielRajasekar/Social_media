const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer'); // Added for handling file uploads
const path = require('path');
const router = express.Router();
const User = require('../models/User');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Save files in 'uploads' folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage: storage });

// User Registration (with profile picture upload)
router.post('/register', upload.single('profilePic'), async (req, res) => {
    try {
        // Check if the email already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create a new user
        const user = new User({
            ...req.body,
            password: hashedPassword,
            profilePic: req.file ? req.file.path : null // Store profile pic path
        });

        // Save the user to the database
        await user.save();

        res.status(201).send(user); // Respond with the created user
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Logout
router.get("/logout", async (req, res) => {
    try {
        res.clearCookie("token", { sameSite: "none", secure: true }).status(200).send("User logout success");
    } catch (err) {
        res.status(500).json(err);
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json('User not found');
        }

        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
            return res.status(401).json('Wrong password');
        }

        const token = jwt.sign(
            {
                _id: user._id,
                email: user.email,
                username: user.username
            },
            "Daniel",
            { expiresIn: "3d" }
        );

        const { password, ...info } = user._doc;

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days
        }).status(200).json(info);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Refetch user data
router.get("/refetch", async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json("No token provided");
        }

        jwt.verify(token, "Daniel", async (err, decoded) => {
            if (err) {
                return res.status(401).json("Invalid token");
            }

            const user = await User.findById(decoded._id).select('-password');
            if (!user) {
                return res.status(404).json("User not found");
            }

            res.status(200).json(user);
        });
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;
