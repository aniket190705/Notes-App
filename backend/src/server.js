import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { MONGO_URI } from "./config.js";
import authRoutes from "./routes/auth.js";
import notesRoutes from "./routes/notes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use(cors({ origin: "https://notes-app-qrpz.onrender.com", credentials: true }));

console.log("MongoDB URI:", MONGO_URI);
mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB error:", err));

app.use("/auth", authRoutes);
app.use("/notes", notesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
