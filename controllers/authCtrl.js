const bcrypt = require("bcrypt")
const db = require("../models")
const jwt = require('jsonwebtoken')
const accessToken = process.env.SECRET_ACCESS_TOKEN
const {sendEmail} = require('../helpers/sendEmail.js')

const registerUser = async (req, res) => {
    const {first_name, last_name, email, password} = req.body
    try {
        newUser = new db.Users({
            first_name,
            last_name, 
            email,
            password
        })
        const existingUser = await db.Users.findOne({email})
        if (existingUser) {
            return res.status(400).json({
                status: "failed",
                data: [],
                message: "You already have an account!"
            })
        }
        const savedUser = await newUser.save()
        const userData = savedUser._doc
        const validationURL = req.protocol + '://' + req.get('host') + `/auth/userValidation/${userData._id}`
        sendEmail(userData.email, "New Account Confirmation from MemeQL.com", `<p>Please click on the link below to confirm your email.</p><p><a href=${validationURL}>Click this link!</a></p>`)
        res.status(200).json({
            status: "success",
            data: [userData],
            message: "Registration successful, enjoy the memes."
            }
        )
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [err],
            message: "Internal Server Error"
        })
    }
    res.end()
}

const validateUser = async (req, res) => {
    userId = req.params.userId
    const user = await db.Users.findById(userId)
    console.log(user.email_validated)
    if (user.email_validated) {
        res.status(200).json({
            status: "success",
            code: 200,
            data: [],
            message: "This account was already validated."
        })
    } else {
        user.email_validated = true
        await db.Users.findByIdAndUpdate(userId, user)
        res.status(200).json({
            status: "success",
            code: 200,
            data: [],
            message: "Account validation completed."
        })
    }
}

const loginUser = async (req, res) => {
    console.log('in the login')
    console.log(req.body)
    const { email } = req.body
    try {
        console.log(email)
        const user = await db.Users.findOne({email}).select("+password")
        console.log(user)
        if (!user) {
            return res.status(401).json({
                status: "failed",
                data: [],
                message: "Wrong email or password."
            })
        }
        if (!user.email_validated) {
            return res.status(401).json({
                status: "failed",
                data: [],
                message: "Account validation incomplete, check your email."
            })
        }
        const isPasswordValid = await bcrypt.compare(`${req.body.password}`, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({
                status: "failed",
                data: [],
                message: "Wrong email or password."
            })
        }
        let options = {
            maxAge: 180 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "None",
        }
        const token = user.generateAccessJWT()
        res.cookie("SessionID", token, options)
        const {password, ...userData} = user._doc
        res.status(200).json({
            status: "success",
            data: [userData],
            message: "Login successful"
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            status: "error", 
            code: 500,
            data: [err],
            message: "Internal Server Error"
        })
    }
    res.end()   
}

const getCurrentUserInfo = async function (req, res, next) {
    console.log(`in getCurrentUserInfo`)
    const header = req.headers["cookie"]
    if (header) {
        const cookie = header.split('=')[1]
        const cookieAccessToken = cookie.split(";")[0] 
        const checkIfBlacklisted = await db.CookieBlacklist.findOne({ token: cookieAccessToken })
        if (checkIfBlacklisted) {
            req.userData = false
            next()
            return
        }
        jwt.verify(cookie, accessToken, async(err, decoded) => {
            if (err) {
                req.userData = false
                next()
                return
            }
            const {id} = decoded
            const user = await db.Users.findById(id).then(res =>{return res})
            const userData = {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
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

const returnCurrentUserInfo = async (req, res) => {
    const header = req.headers["cookie"]
    if (header) {
        const cookie = header.split('=')[1]
        const cookieAccessToken = cookie.split(";")[0] 
        const checkIfBlacklisted = await db.CookieBlacklist.findOne({ token: cookieAccessToken })
        
        if (checkIfBlacklisted) {
            const userData = null
            res.status(400).json({
                status: "failure",
                code: 400,
                data: [userData],
                message: "Attempting to log in with a logged out token, reauthenticate."
            })
        }
        jwt.verify(cookie, accessToken, async(err, decoded) => {
            if (err) {
                const userData = null
                res.status(400).json({
                    status: "failure",
                    code: 400,
                    data: [userData],
                    message: "Error during getting user data"
                })
            }
            const {id} = decoded
            const user = await db.Users.findById(id).then(res =>{return res})
            res.status(200).json({
                status: "success",
                code: 200,
                data: [user],
                message: "Returning user data"
            })
        })
    } else {
        res.status(400).json({
            status: "failure",
            code: 400,
            data: [],
            message: "No headers sent, user data cannot be retrieved"
        })
    }
}

const logoutUser = async (req, res) => {
    try {
        const authHeader = req.headers['cookie']
        const cookie = authHeader.split('=')[1]
        const accessToken = cookie.split(';')[0]
        const checkIfBlacklisted = await db.CookieBlacklist.findOne({token: accessToken})
        if (!checkIfBlacklisted) {
            await db.CookieBlacklist.create({token: accessToken})
        }
        res.setHeader('Clear-Site-Data', '"cookies"')
        res.status(200).json({
            status: "success",
            code: 200,
            data: [],
            message: "User logged out, goodbye"
        })
    } catch (err) {
        console.error(err)
        res.status(200).json({
            status: "error",
            code: 500,
            data: [err],
            message: "Logout failed"
        })
    }
}

module.exports = {
    registerUser,
    loginUser,
    getCurrentUserInfo,
    validateUser,
    logoutUser, 
    returnCurrentUserInfo
}