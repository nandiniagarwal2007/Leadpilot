const express = require("express");
const path = require("path");

const upload = require("./middleware/upload");
const readLeads = require("./services/csvService");

const app = express();

const PORT = 3000;

app.use(express.static("public"));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.post("/upload", upload.single("csvFile"), async (req, res) => {

    try {

        const leads = await readLeads(req.file.path);

        res.json(leads);

    } catch (error) {

        console.log(error);

        res.status(500).send("Error reading CSV");

    }

});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});