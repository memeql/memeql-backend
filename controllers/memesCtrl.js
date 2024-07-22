const db = require("../models")

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

module.exports = {
    createMeme,
}