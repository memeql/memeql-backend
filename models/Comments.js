const mongoose = require("mongoose")

const CommentsSchema = new mongoose.Schema({
    author_user_id: String,
    parent_meme_id: String,
    comment_text: String,
    content_moderation_pass: {
        type: Boolean,
        default: false
    }
})

const Comments = mongoose.model("Comments", CommentsSchema)

module.exports = Comments