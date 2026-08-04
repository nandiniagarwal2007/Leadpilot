const express = require("express");

// Routes
const dashboardRoutes = require("./routes/dashboard");
const uploadRoutes = require("./routes/upload");
const emailRoutes = require("./routes/email");
const historyRoutes = require("./routes/history");
const analyticsRoutes = require("./routes/analytics");

const app = express();

const PORT = 3000;

// Middleware
app.use(express.json());          
app.use(express.static("public"));

// Routes
app.use("/", dashboardRoutes);
app.use("/", uploadRoutes);
app.use("/", emailRoutes);
app.use("/", historyRoutes);
app.use("/", analyticsRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});