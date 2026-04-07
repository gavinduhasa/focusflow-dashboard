const express = require("express");
const router = express.Router();
const pool = require("../db/db");

router.get("/db-test", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.status(200).json({
            success: true,
            message: "Database connected successfully",
            data: result.rows[0],
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Database connection failed",
            error: error.message,
        });
    }
});

module.exports = router;