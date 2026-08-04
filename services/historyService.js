const fs = require("fs");
const path = require("path");

function getCampaignHistory() {

    const filePath = path.join(__dirname, "..", "logs", "campaign.csv");

    if (!fs.existsSync(filePath)) {
        return [];
    }

    const data = fs.readFileSync(filePath, "utf8");

    if (!data.trim()) {
        return [];
    }

    const lines = data.trim().split("\n");

    return lines.map(line => {

        const values = line.split(",");

        return {

            date: values[0].trim(),
            time: values[1].trim(),
            name: values[2].trim(),
            company: values[3].trim(),
            email: values[4].trim(),
            status: values[5].trim()

        };

    });

}

module.exports = getCampaignHistory;