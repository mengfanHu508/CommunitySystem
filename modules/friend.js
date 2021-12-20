const mongoose = require("./db.js")

const FriendSchema = {
    molename: String,
    friendname: String,
}

const Friend = mongoose.model("Friend", FriendSchema, "friends")

module.exports = Friend
