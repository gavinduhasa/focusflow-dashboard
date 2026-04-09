const pool = require("../db/db");

const createTask = async (req, res) => {
    try {
        const { title, description, status, priority, due_date } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Task title is required",
            });
        }

        const result = await pool.query(
            `INSERT INTO tasks (user_id, title, description, status, priority, due_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
            [
                req.user.id,
                title,
                description || null,
                status || "todo",
                priority || "medium",
                due_date || null,
            ]
        );

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            task: result.rows[0],
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create task",
            error: error.message,
        });
    }
};

const getTasks = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM tasks
       WHERE user_id = $1
       ORDER BY created_at DESC`,
            [req.user.id]
        );

        res.status(200).json({
            success: true,
            tasks: result.rows,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch tasks",
            error: error.message,
        });
    }
};

const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT * FROM tasks
       WHERE id = $1 AND user_id = $2`,
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        res.status(200).json({
            success: true,
            task: result.rows[0],
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch task",
            error: error.message,
        });
    }
};

const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, priority, due_date } = req.body;

        const existingTask = await pool.query(
            `SELECT * FROM tasks WHERE id = $1 AND user_id = $2`,
            [id, req.user.id]
        );

        if (existingTask.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        const currentTask = existingTask.rows[0];

        const result = await pool.query(
            `UPDATE tasks
       SET title = $1,
           description = $2,
           status = $3,
           priority = $4,
           due_date = $5,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
            [
                title ?? currentTask.title,
                description ?? currentTask.description,
                status ?? currentTask.status,
                priority ?? currentTask.priority,
                due_date ?? currentTask.due_date,
                id,
                req.user.id,
            ]
        );

        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            task: result.rows[0],
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update task",
            error: error.message,
        });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM tasks
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete task",
            error: error.message,
        });
    }
};

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
};