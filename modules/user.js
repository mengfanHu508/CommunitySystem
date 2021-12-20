const mongoose = require("./db.js")

const UserSchema = {
    molename: String,
    password: String,
    sex: String,
    birth: String,
    region: String,
    spec: String,
    regtime: String,
    headimg: String,
    manager: Number,
    status: {
        type: Number,
        default:1
    }
}

const User = mongoose.model("User", UserSchema, "users")

module.exports = User
