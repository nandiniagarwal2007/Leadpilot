const express = require("express");

// Routes
const dashboardRoutes = require("./routes/dashboard");
const uploadRoutes = require("./routes/upload");
const emailRoutes = require("./routes/email");
const historyRoutes = require("./routes/history");
const analyticsRoutes = require("./routes/analytics");
const connectDB = require("./database/db");

const app = express();



// Middleware
app.use(express.json());          
app.use(express.static("public"));

// Routes
app.use("/", dashboardRoutes);
app.use("/", uploadRoutes);
app.use("/", emailRoutes);
app.use("/", historyRoutes);
app.use("/", analyticsRoutes);
connectDB();


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});