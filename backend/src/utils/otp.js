import nodemailer from "nodemailer";

let otpStore = {}; // in-memory { email: otp }

export const sendOtp = async (email) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    otpStore[email] = otp;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"Notes App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    return otp;
};

export const verifyOtp = (email, otp) => {
    return otpStore[email] && otpStore[email] === otp;
};
