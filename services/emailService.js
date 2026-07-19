const transporter = require("../config/emailConfig");

async function sendEmail(to, subject, text) {

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    };

    try {

        await transporter.sendMail(mailOptions);

        console.log("✅ Email Sent");

    } catch (error) {

        console.log(error);

    }

}

module.exports = sendEmail;