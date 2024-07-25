const bcrypt = require("bcrypt")
const db = require("../models")
const jwt = require('jsonwebtoken')
const accessToken = process.env.SECRET_ACCESS_TOKEN

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

module.exports = {
    registerUser,
    loginUser,
    getCurrentUserInfo
}