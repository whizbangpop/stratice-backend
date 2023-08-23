const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    UserID: {
        type: String,
        required: true
    },
    AuthID: {
        type: String,
        required: true
    },
    DiscordUserID: {
        type: String,
        required: true
    },
    DiscordGuildID: {
        type: String,
        required: true
    },
    AuthSuccessful: {
        type: Boolean,
        required: true
    }
}, { collection: "ToBeRegistered" });

module.exports = mongoose.model('ToBeRegistered', schema);