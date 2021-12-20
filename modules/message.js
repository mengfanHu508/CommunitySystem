const mongoose = require("./db.js")

const MessageSchema = {
    molename: String,
    friendname: String,
    message: String,
    sendtime: String
}

const Message = mongoose.model("Message", MessageSchema, "messages")

module.exports = Message
