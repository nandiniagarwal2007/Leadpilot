require("dotenv").config();

const readLeads = require("./services/csvService");

async function start() {

    const leads = await readLeads("./data/leads.csv");

    console.log(leads);

}

start();