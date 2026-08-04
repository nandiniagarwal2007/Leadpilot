const express = require("express");

const router = express.Router();

const getCampaignHistory = require("../services/historyService");

router.get("/recent-activity", (req, res) => {

    const history = getCampaignHistory();

    const activity = history.slice().reverse().slice(0, 5);

    res.json(activity);

});

router.get("/analytics-data", (req, res) => {

    const history = getCampaignHistory();

    let sent = 0;
    let skipped = 0;

    history.forEach(item => {

        if (item.status === "SENT") {

            sent++;

        } else {

            skipped++;

        }

    });

    res.json({

        total: history.length,

        sent,

        skipped

    });

});

module.exports = router;