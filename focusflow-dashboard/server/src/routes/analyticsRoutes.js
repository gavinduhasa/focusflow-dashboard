const express = require("express");
const router = express.Router();

const {
    getDashboardAnalytics,
    getTaskAnalytics,
    getGoalAnalytics,
} = require("../controllers/analyticsController");

const authMiddleware = require("../middlewares/authMiddleware");

router.get("/dashboard", authMiddleware, getDashboardAnalytics);
router.get("/tasks", authMiddleware, getTaskAnalytics);
router.get("/goals", authMiddleware, getGoalAnalytics);

module.exports = router;