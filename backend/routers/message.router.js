const express = require("express")
const router = express.Router()
const {addMessage, getConversations} = require("../controllers/message.controller")

router.post("/send-message", addMessage)
router.get("/getConversations/:userID", getConversations)

module.exports = router