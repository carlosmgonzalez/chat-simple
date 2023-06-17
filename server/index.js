import express from 'express';
import http from 'http';
import { Server as SocketServer } from "socket.io";
import {resolve} from "path";
import {PORT} from './config.js';


const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);

app.use(express.static(resolve("frontend/dist")));

io.on("connection", socket => {
  console.log("Client connected");
  socket.on("message", (body) => {
    socket.broadcast.emit("message", {
      body,
      from: socket.id.slice(15)
    });
  });

  socket.off('disconnect', () => {
    console.log('Un cliente se ha desconectado');
  });
});

server.listen(PORT, () => (
  console.log(`Server on port: ${PORT}`)
));


  // app.get("/api", (req, res) => {
  //   res.status(200).json({
  //     msg: "todo bien"
  //   });
  // });