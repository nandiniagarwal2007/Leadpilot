const fs = require("fs");
const csv = require("csv-parser");

function readLeads(filePath) {
    return new Promise((resolve, reject) => {

        const leads = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row) => {
                leads.push(row);
            })
            .on("end", () => {
                resolve(leads);
            })
            .on("error", (error) => {
                reject(error);
            });

    });
}

module.exports = readLeads;