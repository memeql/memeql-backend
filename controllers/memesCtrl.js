const db = require("../models")
const jwt = require('jsonwebtoken')
const accessToken = process.env.SECRET_ACCESS_TOKEN

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
            }
            else {
                res.status(200).json({ Data: updatedMeme, Message: "Meme updated" })
            }
        })
}

const createMeme = (req, res) => {
    db.Memes.create(req.body)
        .then((createdMeme) => {
            if (!createdMeme) {
                res.status(400).json({ message: 'Cannot create Meme' })
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
            } else {
                res.status(200).json({ Data: deletedMeme, Message: "Meme deleted" })
            }
        })
}

const getCurrentUserInfo = async function (req, res, next) {
    console.log(`in getCurrentUserInfo`)
    const header = req.headers["cookie"]
    if (header) {
        const cookie = header.split('=')[1]
        const cookieAccessToken = cookie.split(";")[0] // this will eventually be used by the cookie blacklist checking functionality below (logout)
        // const checkIfBlacklisted = await CookieBlacklist.findOne({ token: cookieAccessToken })
        // if (checkIfBlacklisted) {
        //     const userData = {
        //         id: null,
        //         firstName: null,
        //         lastName: null,
        //         email: null
        //     }
        //     req.userData = userData
        //     next()
        //     return
        // }
        jwt.verify(cookie, accessToken, async(err, decoded) => {
            if (err) {
                const userData = {
                    id: null,
                    firstName: null,
                    lastName: null,
                    email: null
                }
                req.userData = userData
                next()
                return
            }
            const {id} = decoded
            const user = await db.Users.findById(id).then(res =>{return res})
            const userData = {
                id: user.id,
                firstName: user.first_name,
                lastName: user.first_name,
                email: user.email
            }
            req.userData = userData
            console.log(`user session is valid, returning user data ${JSON.stringify(userData)}`)
            next()
        })
    } else {
        req.userData = false
        next()
    }
}

module.exports = {
    getMemes,
    createMeme,
    updateMeme,
    deleteMeme,
    getCurrentUserInfo
}