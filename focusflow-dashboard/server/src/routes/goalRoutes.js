const express = require("express");
const router = express.Router();

const {
    createGoal,
    getGoals,
    getGoalById,
    updateGoal,
    deleteGoal,
} = require("../controllers/goalController");

const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, createGoal);
router.get("/", authMiddleware, getGoals);
router.get("/:id", authMiddleware, getGoalById);
router.patch("/:id", authMiddleware, updateGoal);
router.delete("/:id", authMiddleware, deleteGoal);

module.exports = router;