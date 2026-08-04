
const express = require("express");
const path = require("path");
const fs = require("fs");
//routes
const dashboardRoutes = require("./routes/dashboard");
const uploadRoutes = require("./routes/upload");
const emailRoutes = require("./routes/email");
const historyRoutes = require("./routes/history");
const analyticsRoutes = require("./routes/analytics");



const app = express();

const PORT = 3000;

app.use(express.static("public"));
app.use("/", dashboardRoutes);
app.use("/", uploadRoutes);
app.use("/", emailRoutes);
app.use("/", historyRoutes);
app.use("/", analyticsRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});