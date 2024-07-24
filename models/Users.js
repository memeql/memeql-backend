const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

const UsersSchema = new mongoose.Schema(
    {
        first_name: String,
        last_name: String,
        email: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            select: false
        },
        role: String,
        email_validated: Boolean
    },
    {timestamps: true}
)

UsersSchema.pre("save", function (next) {
    const user = this
    if (!user.isModified("password")) return next()
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err)
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err)
            user.password = hash
            next()
        })
    })
})

const Users = mongoose.model("Users", UsersSchema)
module.exports = Users