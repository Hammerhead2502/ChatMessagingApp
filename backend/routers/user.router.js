const express = require("express");
const router = express.Router();
const { loginUser, signUp, getAllUsers, updateUser, logout, getUser } = require("../controllers/user.controller");
const {validateUser} = require("../utils/userValidator")
const {checkAdminAuth} = require("../utils/AdminAuthMiddleware")

router.post("/sign-up", validateUser, signUp);
router.post("/login", loginUser);
router.get("/getUsers", getAllUsers)
router.post("/updateUser", checkAdminAuth, updateUser)
router.post("/logout", logout)
router.post("/getUser", getUser)

module.exports = router;
