const messageModel = require("../models/messages.model")
const userModel = require("../models/user.model")
const conversationModel = require("../models/conversation.model")
const { io } = require("../utils/SocketIO")
const index = require("../index")

const addMessage = async(req,res) => {
    try{
        const {senderID, recipientID, message} = req.body
        const addMsg = await messageModel.create({senderID: senderID, recipientID: recipientID, message: message})
        if(addMsg){
            const conversation = await conversationModel.findOne({"$or" : [{participants: { $elemMatch: { senderID: senderID, recipientID: recipientID }}}, {participants: { $elemMatch: { senderID: recipientID, recipientID: senderID }}}]})
            if(conversation){
                const addConvo = await conversationModel.findOneAndUpdate({"$or" : [{participants: { $elemMatch: { senderID: senderID, recipientID: recipientID }}}, {participants: { $elemMatch: { senderID: recipientID, recipientID: senderID }}}]},{ $push: {messages: addMsg}}, { upsert: true })
                if(addConvo){
                        const recID = index.getRecipientSocketID(recipientID)
                        if(recID){
                            io.to(recID.id).emit("message", addMsg)
                        }
                                return res.status(200).json({
                                    success: true,
                                    message: "Message sent",
                                    data: addMsg
                                })
                            }
                            else{
                                return res.status(504).json({
                                    success:false,
                                    message: "Something went wrong."
                                })
                            }
            }
            else{
                    const newConvo = await conversationModel.create({participants: {senderID: senderID , recipientID: recipientID}, messages: addMsg})
                    if(newConvo){
                        const recID = index.getRecipientSocketID(recipientID)
                        if(recID){
                            io.to(recID.id).emit("message", addMsg)
                        }
                        return res.status(200).json({
                            success: true,
                            message: "Message sent",
                            data: addMsg
                        })
                    }
                    else{
                        return res.status(504).json({
                            success:false,
                            message: "Something went wrong."
                        })
                    }
                }
        }
    }catch(err){
        return res.status(504).json({
            success:false,
            message: err.message
        })
    }
}

const getConversations = async(req,res) => {
    try{
        const userID  = req.params.userID
        const conversation = await conversationModel.find({"$or" : [{participants: { $elemMatch: { senderID: userID }}}, {participants: { $elemMatch: { recipientID: userID }}}]})
        if(conversation){
            return res.status(200).json({
                sucess: true,
                message: "All conversations of users",
                data: conversation
            })
        }
        else{
            return res.status(404).json({
                sucess: true,
                message: "No conversation found",
            })
        }
    }catch(err){
        return res.status(504).json({
            success:false,
            message: err.message
        })
    }
}

module.exports = {addMessage, getConversations}