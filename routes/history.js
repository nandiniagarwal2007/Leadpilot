const express = require("express");

const router = express.Router();

const getCampaignHistory = require("../services/historyService");

router.get("/history", (req, res) => {

    const history = getCampaignHistory();

    res.json(history);

});

module.exports = router;