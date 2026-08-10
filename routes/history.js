const express = require("express");

const router = express.Router();

const Lead = require("../models/Lead");

router.get("/history", async (req, res) => {

    try {

        const leads = await Lead.find()
            .sort({ createdAt: -1 });

        const history = leads.map(lead => {

            const date = new Date(lead.createdAt);

            return {
                date: date.toLocaleDateString(),
                time: date.toLocaleTimeString(),
                name: lead.name,
                company: lead.company,
                email: lead.email,
                status: lead.emailSent ? "SENT" : "PENDING"
            };

        });

        res.json(history);

    } catch (error) {

        console.error("❌ History Error:", error);

        res.status(500).json([]);

    }

});

module.exports = router;