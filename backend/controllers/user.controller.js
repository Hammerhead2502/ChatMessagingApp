const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
require("dotenv").config();

const signUp = async (req, res) => {
  try {
    const { fname, lname, email, password, contact_no, acc_type } = req.body;
    let role = "user";
    const exisUser = await userModel.findOne({ email: email });
    if (exisUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists. Please login.",
      });
    } else {
      let hashedPassword = "";
      if (acc_type == "google") {
        hashedPassword = "none";
      } else {
        bcrypt.hash(password, saltRounds, async function (err, hash) {
          hashedPassword = hash;
        });
      }
      if (email == "dhirenmanekar@gmail.com") {
        role = "admin";
      }
      const addUSer = await userModel.create({
        fname: fname,
        lname: lname,
        email: email,
        password: hashedPassword,
        contact_no: contact_no,
        role: role,
        acc_type: acc_type,
      });
      if (addUSer) {
        const userData = addUSer.toObject();
        delete userData.password;
        delete userData.old_Passwords;
        jwt.sign(
          { userData },
          process.env.JWT_SECRET,
          { algorithm: "HS256" },
          function (error, token) {
            if (!error) {
              return res.status(200).json({
                success: true,
                message: "User logged in.",
                data: userData,
                token: token,
              });
            } else {
              return res.status(504).json({
                success: false,
                message: error.message,
              });
            }
          }
        );
      } else {
        res.status(504).json({
          success: false,
          message: "User creation failed",
        });
      }
    }
  } catch (err) {
    return res.status(504).json({
      success: false,
      message: err.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, acc_type } = req.body;
    const exisUser = await userModel.findOne({ email: email });
    if (exisUser) {
      let verified = false;
      if (acc_type != "google") {
        bcrypt.compare(
          password,
          exisUser.password,
          async function (err, result) {
            if (!err & (result == true)) {
              verified = true;
            }
          }
        );
      }
      const changeStatus = await userModel.updateOne({ email: email}, {$set : {status: "Online"}})
      const userData = exisUser.toObject();
      delete userData.password;
      delete userData.old_Passwords;
      delete userData.contact_no
      delete userData.lname
      jwt.sign(
        { userData },
        process.env.JWT_SECRET,
        { algorithm: "HS256" },
        async function (error, token) {
          if (!error) {
            return res.status(200).json({
              success: true,
              message: "User logged in.",
              data: userData,
              token: token,
            });
          } else {
            return res.status(504).json({
              success: false,
              message: error.message,
            });
          }
        }
      );
    } else {
      return res.status(404).json({
        success: false,
        message: "User not found. Please signUp.",
      });
    }
  } catch (err) {
    return res.status(504).json({
      success: false,
      message: err.message,
    });
  }
};

const getAllUsers = async (req,res) => {
  try{
    const allUsers = await userModel.find()
    const data = allUsers.map((user) => {
      let temp = user.toObject()
      delete temp.password
      delete temp.old_Passwords
      delete temp.contact_no,
      delete temp.lname
      return temp
    })
    if(allUsers){
      return res.status(200).json({
        success: true,
        message: "All user data",
        data: data
      })
    }
    else{
      return res.status(504).json({
        success: false,
        message: "Something went wrong"
      })
    }
  }catch(err){
    return res.status(504).json({
      success: false,
      message: err.message,
    })
  }
}

const updateUser = async(req,res) => {
  try{
      const {data, operation} = req.body
      if(operation == "activate"){
        const update = await userModel.findOneAndUpdate({_id: data}, {$set: {status: 1}})
        if(update){
          return res.status(200).json({
            success: true,
            message: "User updated"
          })
        }
        else{
          return res.status(504).json({
            success: false,
            message: "Something went wrong"
          })
        }
      }
      if(operation == "deactivate"){
        const update = await userModel.findOneAndUpdate({_id: data}, {$set: {status: 0}})
        if(update){
          return res.status(200).json({
            success: true,
            message: "User updated"
          })
        }
        else{
          return res.status(504).json({
            success: false,
            message: "Something went wrong"
          })
        }
      }
      return res.status(200).json({
        success: true,
        message: "All user data",
      })
  }catch(err){
    return res.status(504).json({
      success: false,
      message: err.message,
    })
  }
}

const logout = async(req,res) => {
  try{
    const {userID} = req.body
    const foundUSer = await userModel.find({_id: userID})
    if(foundUSer){
      const update = await userModel.updateOne({_id: userID}, {$set: {lastSeen: Date.now(), status: "Offline"}})
      if(update){
        return res.status(200).json({
          success: true,
          message: "Last seen updated",
          data: foundUSer
        })
      }
      else{
        res.status(504).json({
          success: false,
          message: "Something went wrong"
        })
      }
    }
    else{
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }
  }catch(err){
    res.status(504).json({
      success: false,
      message: err.message
    })
  }
}

const getUser = async(req,res) => {
    try{
      const {userID} = req.body
      const foundUSer = await userModel.findOne({_id: userID})
    if(foundUSer){
      let temp = foundUSer.toObject()
      delete temp.password
      delete temp.old_Passwords
      delete temp.contact_no,
      delete temp.lname
      return res.status(200).json({
        success: true,
        message: "Last seen updated",
        data: temp
      })
    }
    else{
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }
    }catch(err){
      res.status(504).json({
        success: false,
        message: err.message
      })
    }
}

module.exports = { signUp, loginUser, getAllUsers, updateUser, logout, getUser };
