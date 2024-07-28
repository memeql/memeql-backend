const mongoose = require("mongoose");
const CookieBlacklist = require("./CookieBlacklist.js");
const { DATABASE_URL } = process.env

async function connectToMongo() {
    try {
        await mongoose.connect(DATABASE_URL);
        console.log('The connection with mongodb is established');
    } catch (err) {
        console.error('Connection error:', err.message);
    }
}

connectToMongo();

module.exports = {
    Memes: require('./Memes.js'),
    Users: require('./Users.js'),
    Comments: require('./Comments.js'),
    CookieBlacklist: require('./CookieBlacklist.js')
}