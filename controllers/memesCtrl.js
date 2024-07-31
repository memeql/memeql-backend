const db = require("../models")
const {handleFileTransferToBlobStorage} = require('../helpers/transferMemeToAzureStorage.js')

const getMemes = (req, res) => {
    console.log(`in get memes`)
    db.Memes.find({})
        .then((foundMemes) => {
            if (!foundMemes) {
                res.status(404).json({ message: 'Cannot find Memes' })
            } else if (!req.userData.id) {
                console.log(`in get memes, no auth`)
                res.status(401).json({ message: 'User unauthenticated' })
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
            } else if (!req.userData.id) {
                res.status(401).json({ message: 'User unauthenticated' })
            }
            else {
                res.status(200).json({ Data: updatedMeme, Message: "Meme updated" })
            }
        })
}

const createMeme = (req, res) => {
    req.body.image = handleFileTransferToBlobStorage(req.body.image)
    req.body.owner_user_id = req.userData.id
    db.Memes.create(req.body)
        .then((createdMeme) => {
            if (!createdMeme) {
                res.status(400).json({ message: 'Cannot create Meme' })
            } else if (!req.userData.id) {
                res.status(401).json({ message: 'User unauthenticated' })
            }
             else {
                res.status(201).json({ data: createdMeme, message: 'Meme created' })
            }
        })
}

const deleteMeme = (req, res) => {
    db.Memes.findByIdAndDelete(req.params.id)
        .then((deletedMeme) => {
            if (!deletedMeme) {
                res.status(400).json({ Message: 'Could not delete Meme' })
            } else if (!req.userData.id) {
                res.status(401).json({ message: 'User unauthenticated' })
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