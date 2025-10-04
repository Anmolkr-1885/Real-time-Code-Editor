import express from "express";
import http from "http";
const app = express();
import { Server } from "socket.io";
import path from "path";





const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const rooms = new Map();

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  let currentRoom = null;
  let currentUser = null;

  socket.on("join", ({ roomId, username }) => {
    if (currentRoom) {
      socket.leave(currentRoom);
      rooms.get(currentRoom).delete(currentUser);
      io.to(currentRoom).emit("user-left", Array.from(rooms.get(currentRoom)));
    }

    currentRoom = roomId;
    currentUser = username;
    socket.join(roomId);
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }

    rooms.get(roomId).add(username);
    io.to(roomId).emit("user-joined", Array.from(rooms.get(currentRoom)));

  });

   socket.on("code-change",({roomId,code})=>{
    socket.to(roomId).emit("code-update",code);
   });

   socket.on("leave-room",()=>{
    if(currentRoom && currentUser){
        rooms.get(currentRoom).delete(currentUser);
        io.to(currentRoom).emit("user-left",Array.from(rooms.get(currentRoom)));
    }
    socket.leave(currentRoom);
    currentRoom=null;
    currentUser=null;


   })

   socket.on("typing",({roomId,username})=>{
    socket.to(roomId).emit("user-typing",username);
   })

   socket.on("language-change",({roomId,language})=>{
    socket.to(roomId).emit("language-update",language);
   })

   socket.on("disconnect",()=>{
    if(currentRoom && currentUser){
        rooms.get(currentRoom).delete(currentUser);
        io.to(currentRoom).emit("user-left",Array.from(rooms.get(currentRoom)));
    }
    console.log(`User disconnected: ${socket.id}`);
   })

});

const PORT = process.env.PORT || 5000;


const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend","dist", "index.html"));
});





server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
