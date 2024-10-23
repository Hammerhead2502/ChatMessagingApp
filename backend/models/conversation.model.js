const mongoose = require("mongoose")
const Schema = mongoose.Schema
const userModel = require("./user.model")

const conversationSchema = new Schema({
    participants:[
        {senderID: {
            type:Schema.Types.ObjectId,
            required: true,
            ref: userModel
        },
        recipientID: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: userModel
        }
    }
    ],    
    messages: {
        type: Array,
        default: []
    }
})

module.exports = mongoose.model("conversation", conversationSchema)