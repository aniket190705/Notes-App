import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_SECRET } from "../config.js";
import { sendOtp, verifyOtp } from "../utils/otp.js";

const router = express.Router();

// Google/Firebase signup-login
router.post("/google", async (req, res) => {
    const { email, name } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ email, name, authProvider: "google" });
        }
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
            expiresIn: "1h"
        });
        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// OTP mock signup-login
router.post("/otp", async (req, res) => {
    const { email } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ email, name: email.split("@")[0], authProvider: "otp" });
        }
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
            expiresIn: "1h"
        });
        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});






// Request OTP
router.post("/send-otp", async (req, res) => {
    const { email } = req.body;
    try {
        await sendOtp(email);
        res.json({ message: "OTP sent to email" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to send OTP" });
    }
});

// Verify OTP and login/signup
router.post("/verify-otp", async (req, res) => {
    const { email, otp } = req.body;
    try {
        if (!verifyOtp(email, otp)) {
            return res.status(400).json({ error: "Invalid OTP" });
        }

        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                email,
                name: email.split("@")[0],
                authProvider: "otp",
            });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});




export default router;
