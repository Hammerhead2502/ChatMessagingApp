const {model} = require("../utils/GeminiAI")

const getReply = async(req,res) => {
try{
    const {msg} = req.body
 const result = await model.generateContent(msg);
if(result){
    res.status(200).json({
        success: true,
        message: "Here is your reply",
        data: result.response.text()
    })
}
else{
    res.status(504).json({
        success: false,
        message: "Something went wrong"
    })
}
}catch(err){
    res.status(504).json({
        success: false,
        message: err.message
    })
}
}

module.exports = {getReply}