const pool = require("../db/db");

const initSettings = async (req, res) => {
    try {
        const existing = await pool.query(
            `SELECT * FROM settings WHERE user_id = $1`,
            [req.user.id]
        );

        if (existing.rows.length > 0) {
            return res.status(200).json({
                success: true,
                message: "Settings already exist",
                settings: existing.rows[0],
            });
        }

        const result = await pool.query(
            `INSERT INTO settings (user_id)
       VALUES ($1)
       RETURNING *`,
            [req.user.id]
        );

        res.status(201).json({
            success: true,
            message: "Settings initialized successfully",
            settings: result.rows[0],
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to initialize settings",
            error: error.message,
        });
    }
};

const getSettings = async (req, res) => {
    try {
        let result = await pool.query(
            `SELECT * FROM settings WHERE user_id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            result = await pool.query(
                `INSERT INTO settings (user_id)
         VALUES ($1)
         RETURNING *`,
                [req.user.id]
            );
        }

        res.status(200).json({
            success: true,
            settings: result.rows[0],
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch settings",
            error: error.message,
        });
    }
};

const updateSettings = async (req, res) => {
    try {
        const {
            theme,
            language,
            notifications,
            email_updates,
            timezone,
        } = req.body;

        let existing = await pool.query(
            `SELECT * FROM settings WHERE user_id = $1`,
            [req.user.id]
        );

        if (existing.rows.length === 0) {
            existing = await pool.query(
                `INSERT INTO settings (user_id)
         VALUES ($1)
         RETURNING *`,
                [req.user.id]
            );
        }

        const current = existing.rows[0];

        const result = await pool.query(
            `UPDATE settings
       SET theme = $1,
           language = $2,
           notifications = $3,
           email_updates = $4,
           timezone = $5,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $6
       RETURNING *`,
            [
                theme ?? current.theme,
                language ?? current.language,
                notifications ?? current.notifications,
                email_updates ?? current.email_updates,
                timezone ?? current.timezone,
                req.user.id,
            ]
        );

        res.status(200).json({
            success: true,
            message: "Settings updated successfully",
            settings: result.rows[0],
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update settings",
            error: error.message,
        });
    }
};

module.exports = {
    initSettings,
    getSettings,
    updateSettings,
};