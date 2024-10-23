const {app, httpServer, corsOptions, io} = require("./utils/SocketIO")
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routers/user.router");
const cookieParser = require("cookie-parser")
const messageRouter = require("./routers/message.router")
const express = require("express")
const axios = require("axios")
const geminiAIRouter = require("./routers/geminiAI.router")

app.use(cors(corsOptions));

app.use(express.json());

let users = {}

io.on("connection", async(socket) => {
  const userID = socket.handshake.query.userID
  if(userID){
    users[userID] = {
      id: socket.id,
      status: "Online", 
      lastSeen: ""
    }
  }
  io.emit("online users", users)

  socket.on('disconnect', async() => {
    await axios.post("http://localhost:3000/getUser", {userID: userID}).then((res) => {
      if(res.status == 200){
        users[userID] = {...users[userID], lastSeen: res?.data?.data?.lastSeen, status: "Offline"}
        io.emit("online users", users)
      }
    }).catch((err) => console.log(err))
  });
});

exports.getRecipientSocketID = (recipientID) => {
  return users[recipientID]
}

mongoose
  .connect(
    "mongodb+srv://dhirenmanekar:7DQDA1tQEmz96ftU@cluster0.kwqslfl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("DB connected"));

app.use(userRouter);
app.use(messageRouter)
app.use(geminiAIRouter)
app.use(cookieParser)

httpServer.listen(3000);