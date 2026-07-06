const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    email: {
        type: String
    },

    issueCategory: {
        type: String,
        required: true
    },

    issueDescription: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: "Open"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Customer", customerSchema);



