const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    company: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    industry: {
        type: String,
        required: true
    },

    employees: {
        type: Number,
        required: true
    },

    emailGenerated: {
        type: Boolean,
        default: false
    },

    emailSent: {
        type: Boolean,
        default: false
    },

    generatedEmail: {
        type: String,
        default: ""
    },
    followUpGenerated: {
    type: Boolean,
    default: false
},

followUpEmail: {
    type: String,
    default: ""
},
    leadScore: {
    type: Number,
    default: null
},

leadPriority: {
    type: String,
    default: null
},

leadScoreReasons: {
    type: [String],
    default: []
},

    createdAt: {
        type: Date,
        default: Date.now
    }

    

});

module.exports = mongoose.model("Lead", leadSchema);