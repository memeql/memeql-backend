const db = require("../models")

const getMemes = (req, res) => {
    db.Memes.find({})
        .then((foundMemes) => {
            if (!foundMemes) {
                res.status(404).json({ message: 'Cannot find Memes' })
            } else {
                res.status(200).json({ data: foundMemes })
            }
        })
}

const updateMeme = (req, res) => {
    db.Memes.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((updatedMeme) => {
            if (!updatedMeme) {
                res.status(400).json({ Message: 'Could not update Meme' })
            } else {
                res.status(200).json({ Data: updatedMeme, Message: "Meme updated" })
            }
        })
}

const createMeme = (req, res) => {
    db.Memes.create(req.body)
        .then((createdMeme) => {
            if (!createdMeme) {
                res.status(400).json({ message: 'Cannot create Meme' })
            } else {
                res.status(201).json({ data: createdMeme, message: 'Meme created' })
            }
        })
}

const deleteMeme = (req, res) => {
    db.Memes.findByIdAndDelete(req.params.id)
        .then((deletedMeme) => {
            if (!deletedMeme) {
                res.status(400).json({ Message: 'Could not delete Meme' })
            } else {
                res.status(200).json({ Data: deletedMeme, Message: "Meme deleted" })
            }
        })
}

module.exports = {
    getMemes,
    createMeme,
    updateMeme,
    deleteMeme
}