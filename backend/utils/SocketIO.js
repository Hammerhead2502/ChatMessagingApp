const express = require("express")
const app = express()
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config()

const corsOptions = {
    origin: [process.env.FRONTEND_URL],
    credentials: true
  };

  const httpServer = createServer(app);
  const io = new Server(httpServer, { 
    cors: corsOptions });

module.exports = {app, httpServer, corsOptions, io,}
