require("dotenv").config();

const logCampaign = require("./services/logService");
const readline = require("readline-sync");
const readLeads = require("./services/csvService");
const generateEmail = require("./services/aiService");
const sendEmail = require("./services/emailService");

async function start() {

    try {

        const leads = await readLeads("./data/leads.csv");

        console.log(`Found ${leads.length} leads.\n`);

        for (const lead of leads) {

            console.log("----------------------------");
            console.log(`Name: ${lead.name}`);
            console.log(`Company: ${lead.company}`);
            console.log("----------------------------");

            const email = await generateEmail(lead);

            if (!email) {
                console.log("❌ AI could not generate email.");
                continue;
            }

            console.log(email);

            const answer = readline.question(
    "\nSend this email? (Y/N): "
);

if (answer.toUpperCase() === "Y") {

    await sendEmail(
        lead.email,
        `Helping ${lead.company} Grow with AI`,
        email
    );

    console.log("✅ Email Sent!");
    logCampaign(lead, "SENT");

} else {

    console.log("⏭ Email Skipped.");
    logCampaign(lead, "SKIPPED");

}

console.log("\n");

            console.log("\n");

        }

    } catch (error) {
        console.log(error);
    }

}

start();