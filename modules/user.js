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
    vip:Number
}

const User = mongoose.model("User", UserSchema, "users")

module.exports = User
