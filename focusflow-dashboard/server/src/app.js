const express = require("express");
const cors = require("cors");
const testRoutes = require("./routes/testRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "FocusFlow API is running",
  });
});

app.use("/api/v1", testRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", require("./routes/taskRoutes"));

module.exports = app;