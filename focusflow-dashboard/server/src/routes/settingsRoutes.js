const express = require("express");
const router = express.Router();

const {
    initSettings,
    getSettings,
    updateSettings,
} = require("../controllers/settingsController");

const authMiddleware = require("../middlewares/authMiddleware");

router.post("/init", authMiddleware, initSettings);
router.get("/", authMiddleware, getSettings);
router.patch("/", authMiddleware, updateSettings);

module.exports = router;