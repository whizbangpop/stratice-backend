const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    UserID: {
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
}, { collection: "RegisteredUsers" });

module.exports = mongoose.model('RegisteredUsers', schema)