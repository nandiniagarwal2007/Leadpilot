const express = require("express");

const router = express.Router();

const sendEmail = require("../services/emailService");
const generateEmail = require("../services/aiService");

router.post("/generate-email", async (req, res) => {

    try {

        const lead = req.body;

        const email = await generateEmail(lead);

        res.json({
            success: true,
            email: email
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false
        });

    }

});

router.post("/send-email", async (req, res) => {

    try {

        const { email, subject, body } = req.body;

        await sendEmail(email, subject, body);

        res.json({
            success: true
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false
        });

    }

});

module.exports = router;