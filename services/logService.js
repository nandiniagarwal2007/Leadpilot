const fs = require("fs");
const path = require("path");

function logCampaign(lead, status) {

    const logFolder = path.join(__dirname, "../logs");

    if (!fs.existsSync(logFolder)) {
        fs.mkdirSync(logFolder);
    }

    const logFile = path.join(logFolder, "campaign.csv");

    const time = new Date().toLocaleString();

    const log = `${time},${lead.name},${lead.company},${lead.email},${status}\n`;

    fs.appendFileSync(logFile, log);

}

module.exports = logCampaign;