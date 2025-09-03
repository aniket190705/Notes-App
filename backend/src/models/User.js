import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: String,
    authProvider: { type: String, enum: ["google", "otp"], required: true }
});

export default mongoose.model("User", userSchema);
