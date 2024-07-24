const bcrypt = require("bcrypt")
const db = require("../models")

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
        const {password, ...userData} = user._doc
        res.status(200).json({
            status: "success",
            data: [userData],
            message: "Login successful"
        })
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

module.exports = {
    registerUser,
    loginUser
}