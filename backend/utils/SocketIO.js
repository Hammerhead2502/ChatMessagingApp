const express = require("express")
const app = express()
const { createServer } = require("http");
const { Server } = require("socket.io");

const corsOptions = {
    origin: ["http://localhost:5173"],
    credentials: true
  };
  
  const httpServer = createServer(app);
  const io = new Server(httpServer, { 
    cors: corsOptions });

module.exports = {app, httpServer, corsOptions, io,}