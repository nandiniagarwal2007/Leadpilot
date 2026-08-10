const express = require("express");

const router = express.Router();

const sendEmail = require("../services/emailService");
const generateEmail = require("../services/aiService");
const Lead = require("../models/Lead");


// ===============================
// GENERATE EMAIL
// ===============================

router.post("/generate-email", async (req, res) => {

    try {

        const lead = req.body;

        // Generate email using Groq
        const email = await generateEmail(lead);

        if (!email) {
            return res.status(500).json({
                success: false,
                message: "Email generation failed"
            });
        }

        // Save generated email in MongoDB
        await Lead.findOneAndUpdate(
            { email: lead.email },
            {
                emailGenerated: true,
                generatedEmail: email
            }
        );

        console.log(`✅ Email generated for ${lead.email}`);

        res.json({
            success: true,
            email: email
        });

    } catch (error) {

        console.error("❌ Generate Email Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to generate email"
        });

    }

});


// ===============================
// SEND EMAIL
// ===============================

router.post("/send-email", async (req, res) => {

    try {

        const { email, subject, body } = req.body;

        // Send email
        await sendEmail(email, subject, body);

        // Update MongoDB after successful sending
        await Lead.findOneAndUpdate(
            { email: email },
            {
                emailSent: true
            }
        );

        console.log(`✅ Email sent to ${email}`);

        res.json({
            success: true
        });

    } catch (error) {

        console.error("❌ Send Email Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to send email"
        });

    }

});


module.exports = router;