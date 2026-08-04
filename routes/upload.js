const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");
const readLeads = require("../services/csvService");

router.post("/upload", upload.single("csvFile"), async (req, res) => {

    try {

        const leads = await readLeads(req.file.path);

        res.json(leads);

    } catch (error) {

        console.log(error);

        res.status(500).send("Error reading CSV");

    }

});

module.exports = router;