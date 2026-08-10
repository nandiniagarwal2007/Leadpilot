const express = require("express");
const path = require("path");
const Lead = require("../models/Lead");

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

router.get("/leads", async (req, res) => {

    try {

        const leads = await Lead.find().sort({ createdAt: -1 });

        res.json(leads);

    } catch (error) {

        console.error("❌ Error fetching leads:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch leads"
        });

    }

});

router.delete("/leads/:id", async (req, res) => {

    try {

        const deletedLead = await Lead.findByIdAndDelete(req.params.id);

        if (!deletedLead) {
            return res.status(404).json({
                success: false,
                message: "Lead not found"
            });
        }

        console.log(`🗑️ Lead deleted: ${deletedLead.email}`);

        res.json({
            success: true,
            message: "Lead deleted successfully"
        });

    } catch (error) {

        console.error("❌ Delete Lead Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete lead"
        });

    }

});

router.put("/leads/:id", async (req, res) => {

    try {

        const updatedLead = await Lead.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                company: req.body.company,
                email: req.body.email,
                industry: req.body.industry,
                employees: req.body.employees
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedLead) {

            return res.status(404).json({
                success: false,
                message: "Lead not found"
            });

        }

        console.log(`✏️ Lead updated: ${updatedLead.email}`);

        res.json({
            success: true,
            lead: updatedLead
        });

    } catch (error) {

        console.error("❌ Update Lead Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update lead"
        });

    }

});

module.exports = router;