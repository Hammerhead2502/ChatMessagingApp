const mongoose = require("mongoose")
const Schema = mongoose.Schema
const userModel = require("./user.model")

const messageSchema = new Schema({
    senderID: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: userModel
    },
    recipientID: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: userModel
    },
    message: {
        type: String,
        default: ""
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: Number,
        default: 1
    }
})

module.exports = mongoose.model("message", messageSchema)