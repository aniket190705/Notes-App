import express from "express";
import Note from "../models/Note.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Get notes
router.get("/", authMiddleware, async (req, res) => {
    const notes = await Note.find({ userId: req.user.id });
    res.json(notes);
});

// Create note
router.post("/", authMiddleware, async (req, res) => {
    const note = await Note.create({ userId: req.user.id, content: req.body.content });
    res.json(note);
});

// Delete note
router.delete("/:id", authMiddleware, async (req, res) => {
    await Note.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: "Note deleted" });
});

export default router;
