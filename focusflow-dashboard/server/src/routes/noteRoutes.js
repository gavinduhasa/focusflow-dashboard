const express = require("express");
const router = express.Router();

const {
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote,
} = require("../controllers/noteController");

const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, createNote);
router.get("/", authMiddleware, getNotes);
router.get("/:id", authMiddleware, getNoteById);
router.patch("/:id", authMiddleware, updateNote);
router.delete("/:id", authMiddleware, deleteNote);

module.exports = router;