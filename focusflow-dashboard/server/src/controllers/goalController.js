const pool = require("../db/db");

const createGoal = async (req, res) => {
    try {
        const { title, description, target_value, current_value, unit, deadline, status } = req.body;

        if (!title || target_value === undefined) {
            return res.status(400).json({
                success: false,
                message: "Title and target_value are required",
            });
        }

        const result = await pool.query(
            `INSERT INTO goals (user_id, title, description, target_value, current_value, unit, deadline, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
            [
                req.user.id,
                title,
                description || null,
                target_value,
                current_value || 0,
                unit || "steps",
                deadline || null,
                status || "active",
            ]
        );

        res.status(201).json({
            success: true,
            message: "Goal created successfully",
            goal: result.rows[0],
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create goal",
            error: error.message,
        });
    }
};

const getGoals = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM goals
       WHERE user_id = $1
       ORDER BY created_at DESC`,
            [req.user.id]
        );

        res.status(200).json({
            success: true,
            goals: result.rows,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch goals",
            error: error.message,
        });
    }
};

const getGoalById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT * FROM goals WHERE id = $1 AND user_id = $2`,
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Goal not found",
            });
        }

        res.status(200).json({
            success: true,
            goal: result.rows[0],
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch goal",
            error: error.message,
        });
    }
};

const updateGoal = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, target_value, current_value, unit, deadline, status } = req.body;

        const existing = await pool.query(
            `SELECT * FROM goals WHERE id = $1 AND user_id = $2`,
            [id, req.user.id]
        );

        if (existing.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Goal not found",
            });
        }

        const current = existing.rows[0];

        const result = await pool.query(
            `UPDATE goals
       SET title = $1,
           description = $2,
           target_value = $3,
           current_value = $4,
           unit = $5,
           deadline = $6,
           status = $7,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 AND user_id = $9
       RETURNING *`,
            [
                title ?? current.title,
                description ?? current.description,
                target_value ?? current.target_value,
                current_value ?? current.current_value,
                unit ?? current.unit,
                deadline ?? current.deadline,
                status ?? current.status,
                id,
                req.user.id,
            ]
        );

        res.status(200).json({
            success: true,
            message: "Goal updated successfully",
            goal: result.rows[0],
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update goal",
            error: error.message,
        });
    }
};

const deleteGoal = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM goals WHERE id = $1 AND user_id = $2 RETURNING *`,
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Goal not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Goal deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete goal",
            error: error.message,
        });
    }
};

module.exports = {
    createGoal,
    getGoals,
    getGoalById,
    updateGoal,
    deleteGoal,
};