const express = require("express");
const path = require("path");

const router = express.Router();

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

router.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "dashboard.html"));
});

router.get("/history-page", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "history.html"));
});

router.get("/analytics", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "analytics.html"));
});

router.get("/settings", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "settings.html"));
});

module.exports = router;