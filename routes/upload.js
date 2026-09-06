const express = require("express");
const router = express.Router();
const fs = require("fs");

const upload = require("../middleware/upload");
const readLeads = require("../services/csvService");
const Lead = require("../models/Lead");

router.post("/upload", upload.single("csvFile"), async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No CSV file uploaded"
            });
        }

        // Read leads from CSV
        const leads = await readLeads(req.file.path);

        // Save leads to MongoDB
        const savedLeads = [];

        for (const lead of leads) {

            // Check if this email already exists
            const existingLead = await Lead.findOne({
                email: lead.email
            });

            if (existingLead) {
                continue;
            }

            const newLead = new Lead({
                name: lead.name,
                company: lead.company,
                email: lead.email,
                industry: lead.industry,
                employees: Number(lead.employees)
            });

            const savedLead = await newLead.save();

            savedLeads.push(savedLead);
        }

        console.log(
            `✅ ${savedLeads.length} new leads saved to MongoDB`
        );

        res.json(savedLeads);

    } catch (error) {

        console.error("❌ Upload Error:", error);

        res.status(500).json({
            success: false,
            message: "Error uploading CSV"
        });

    } finally {

        // Delete temporary CSV after processing
        if (req.file && req.file.path) {

            fs.unlink(req.file.path, (error) => {

                if (error) {
                    console.error(
                        "⚠️ Could not delete temporary CSV:",
                        error.message
                    );
                } else {
                    console.log(
                        "🗑️ Temporary CSV deleted"
                    );
                }

            });

        }

    }

});
module.exports = router;