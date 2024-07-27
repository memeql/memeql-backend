const db = require('../models')

const getCommentsByMemeId = (req, res) => {
    const memeId = req.params.memeId
    db.Comments.find({parent_meme_id: memeId})
        .then((foundCommentsForMemeId) => {
            if (!foundCommentsForMemeId) {
                res.status(404).json({ message: 'Cannot find Comments' })
            } else if (!req.userData.id) {
                res.status(401).json({ message: 'User unauthenticated' })
            } else {
                res.status(200).json({ data: foundCommentsForMemeId })
            }
        })
}

const updateComment = (req, res) => {
    db.Comments.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((updatedComment) => {
            if (!updatedComment) {
                res.status(400).json({ Message: 'Could not update Comment' })
            } else if (!req.userData.id) {
                res.status(401).json({ message: 'User unauthenticated' })
            }
            else {
                res.status(200).json({ Data: updatedComment, Message: "Comment updated" })
            }
        })
}

const createComment = (req, res) => {
    db.Comments.create(req.body)
        .then((createdComment) => {
            if (!createdComment) {
                res.status(400).json({ message: 'Cannot create Comment' })
            } else if (!req.userData.id) {
                res.status(401).json({ message: 'User unauthenticated' })
            }
             else {
                res.status(201).json({ data: createdComment, message: 'Comment created' })
            }
        })
}

const deleteComment = (req, res) => {
    db.Comments.findByIdAndDelete(req.params.id)
        .then((deletedComment) => {
            if (!deletedComment) {
                res.status(400).json({ Message: 'Could not delete Comment' })
            } else if (!req.userData.id) {
                res.status(401).json({ message: 'User unauthenticated' })
            } else {
                res.status(200).json({ Data: deletedComment, Message: "Comment deleted" })
            }
        })
}

module.exports = {
    getCommentsByMemeId,
    createComment,
    updateComment,
    deleteComment
}