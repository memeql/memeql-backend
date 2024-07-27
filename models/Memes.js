const mongoose = require("mongoose")

const MemesSchema = new mongoose.Schema({
    title: String,
    image: String,
    owner_user_id: String,
    description: String,
    tags: [{String}],
    liked_by: [{String}],
    seen_by: [{String}],
    content_moderation_pass: {
        type: Boolean,
        default: false
    }
});

const Memes = mongoose.model("Memes", MemesSchema);

module.exports = Memes