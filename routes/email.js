const express = require("express");

const router = express.Router();

const sendEmail = require("../services/emailService");
const { generateEmail, generateFollowUp } = require("../services/aiService");
const scoreLead = require("../services/leadScoringService");
const generateOutreachRecommendation =
    require("../services/outreachRecommendationService");
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
// AI FOLLOW-UP GENERATION
// ===============================

router.post("/generate-follow-up", async (req, res) => {

    try {

        const { lead, previousEmail } = req.body;

        if (!lead || !previousEmail) {
            return res.status(400).json({
                success: false,
                message: "Lead and previous email are required"
            });
        }

        // Generate follow-up using Groq
        const followUp =
            await generateFollowUp(lead, previousEmail);

        if (!followUp) {
            return res.status(500).json({
                success: false,
                message: "Follow-up generation failed"
            });
        }

        // Save follow-up in MongoDB
        await Lead.findOneAndUpdate(
            { email: lead.email },
            {
                followUpGenerated: true,
                followUpEmail: followUp
            }
        );

        console.log(
            `✅ Follow-up generated for ${lead.email}`
        );

        res.json({
            success: true,
            followUp: followUp
        });

    } catch (error) {

        console.error(
            "❌ Follow-Up Generation Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to generate follow-up"
        });

    }

});

// ===============================
// AI LEAD SCORING
// ===============================

router.post("/score-lead", async (req, res) => {

    try {

        const lead = req.body;

        const result = await scoreLead(lead);

        if (!result) {
            return res.status(500).json({
                success: false,
                message: "Lead scoring failed"
            });
        }

        // Save score in MongoDB
        await Lead.findOneAndUpdate(
            { email: lead.email },
            {
                leadScore: result.score,
                leadPriority: result.priority,
                leadScoreReasons: result.reasons
            }
        );

        console.log(`✅ Lead scored: ${lead.email} → ${result.score}`);

        res.json({
            success: true,
            score: result.score,
            priority: result.priority,
            reasons: result.reasons
        });

    } catch (error) {

        console.error("❌ Lead Scoring Route Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to score lead"
        });

    }

});

// ===============================
// SMART OUTREACH RECOMMENDATION
// ===============================

router.post("/outreach-recommendation", async (req, res) => {

    try {

        const lead = req.body;

        const recommendation =
            await generateOutreachRecommendation(lead);

        if (!recommendation) {

            return res.status(500).json({
                success: false,
                message: "Outreach recommendation failed"
            });

        }

        console.log(
            `✅ Outreach recommendation generated for ${lead.email}`
        );

        res.json({
            success: true,
            recommendation: recommendation
        });

    } catch (error) {

        console.error(
            "❌ Outreach Recommendation Route Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to generate outreach recommendation"
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