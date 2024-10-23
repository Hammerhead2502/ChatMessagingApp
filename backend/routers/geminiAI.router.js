const express = require("express")
const router = express.Router()
const {getReply} = require("../controllers/geminiAI.controller")

router.post("/getAIreply", getReply)

module.exports = router