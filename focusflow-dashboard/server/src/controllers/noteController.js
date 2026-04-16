const pool = require("../db/db");

const createNote = async (req, res) => {
    try {
        const { title, content, is_pinned } = req.body;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: "Content is required",
            });
        }

        const result = await pool.query(
            `INSERT INTO notes (user_id, title, content, is_pinned)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
            [req.user.id, title || null, content, is_pinned || false]
        );

        res.status(201).json({
            success: true,
            message: "Note created successfully",
            note: result.rows[0],
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create note",
            error: error.message,
        });
    }
};

const getNotes = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM notes
       WHERE user_id = $1
       ORDER BY is_pinned DESC, created_at DESC`,
            [req.user.id]
        );

        res.status(200).json({
            success: true,
            notes: result.rows,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch notes",
            error: error.message,
        });
    }
};

const getNoteById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT * FROM notes WHERE id = $1 AND user_id = $2`,
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Note not found",
            });
        }

        res.status(200).json({
            success: true,
            note: result.rows[0],
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch note",
            error: error.message,
        });
    }
};

const updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, is_pinned } = req.body;

        const existing = await pool.query(
            `SELECT * FROM notes WHERE id = $1 AND user_id = $2`,
            [id, req.user.id]
        );

        if (existing.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Note not found",
            });
        }

        const current = existing.rows[0];

        const result = await pool.query(
            `UPDATE notes
       SET title = $1,
           content = $2,
           is_pinned = $3,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
            [
                title ?? current.title,
                content ?? current.content,
                is_pinned ?? current.is_pinned,
                id,
                req.user.id,
            ]
        );

        res.status(200).json({
            success: true,
            message: "Note updated successfully",
            note: result.rows[0],
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update note",
            error: error.message,
        });
    }
};

const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING *`,
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Note not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Note deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete note",
            error: error.message,
        });
    }
};

module.exports = {
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote,
};