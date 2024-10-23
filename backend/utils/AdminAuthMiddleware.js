const jwt = require("jsonwebtoken")
require("dotenv").config()

const checkAdminAuth = async(req,res, next) => {
    const token = req.headers?.authorization
    jwt.verify(token, process.env.JWT_SECRET, async function(err, decoded) {
        if(!err){
            if(decoded?.userData?.role == "admin"){
                next()
            }
            else{
                res.status(401).json({
                    success:false,
                    message: "This is not an admin account"
                })
            }
        } 
        else{
            res.status(504).json({
                success:false,
                message: "Invalid Token"
            })
        }
      });
      
    
}

module.exports = {checkAdminAuth}