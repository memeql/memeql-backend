const mongoose = require("mongoose");

const MemesSchema = new mongoose.Schema({
    title: String,
    image: String,
    owner_user_id: String,
    description: String,
    tags: [{
        String
    }],
    comments: [{
        owner_user_id: String,
        timestamp: Date,
        text: String
    }]
});

const Memes = mongoose.model("Memes", MemesSchema);

module.exports = Memes