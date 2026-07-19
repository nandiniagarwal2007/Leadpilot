const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendEmail() {

    const transporter = nodemailer.createTransport({

        service: "gmail",

        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }

    });

    const mailOptions = {

        from: process.env.EMAIL_USER,

        to: process.env.EMAIL_USER,

        subject: "🚀 LeadPilot Test Email",

        text: "Congratulations! Your first automated email has been sent successfully."

    };

    try {

        await transporter.sendMail(mailOptions);

        console.log("✅ Email Sent Successfully!");

    } catch (error) {

        console.log(error);

    }

}

sendEmail();