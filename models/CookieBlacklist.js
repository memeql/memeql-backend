const mongoose = require("mongoose")

const CookieBlacklistSchema = new mongoose.Schema({
    token: 
    {
        type: String, 
        required: true
    }}, {timestamps: true}
)

const CookieBlacklist = mongoose.model('CookieBlacklist', CookieBlacklistSchema)
module.exports = CookieBlacklist