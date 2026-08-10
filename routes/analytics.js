const express = require("express");

const router = express.Router();

const Lead = require("../models/Lead");


// ===============================
// RECENT ACTIVITY
// ===============================

router.get("/recent-activity", async (req, res) => {

    try {

        const leads = await Lead.find()
            .sort({ createdAt: -1 })
            .limit(5);

        const activity = leads.map(lead => {

            let status = "PENDING";

            if (lead.emailSent) {
                status = "SENT";
            } else if (lead.emailGenerated) {
                status = "GENERATED";
            }

            return {
                name: lead.name,
                company: lead.company,
                email: lead.email,
                status: status,
                time: lead.createdAt
            };

        });

        res.json(activity);

    } catch (error) {

        console.error("❌ Recent Activity Error:", error);

        res.status(500).json([]);

    }

});


// ===============================
// ANALYTICS
// ===============================

router.get("/analytics-data", async (req, res) => {

    try {

        const total = await Lead.countDocuments();

        const generated = await Lead.countDocuments({
            emailGenerated: true
        });

        const sent = await Lead.countDocuments({
            emailSent: true
        });

        const skipped = total - sent;

        res.json({

            total,
            generated,
            sent,
            skipped

        });

    } catch (error) {

        console.error("❌ Analytics Error:", error);

        res.status(500).json({

            total: 0,
            generated: 0,
            sent: 0,
            skipped: 0

        });

    }

});


module.exports = router;