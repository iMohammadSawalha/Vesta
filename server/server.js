const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "http://localhost:4173"],
  })
);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:4173"],
  },
});
const user = require("./routes/user");
const workspace = require("./routes/workspace");
// const issue = require("./routes/issue");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const SocketIoTokenAuth = require("./middleware/socket.ioTokenAuth");
const {
  workspaceAuthSocketIo,
} = require("./middleware/socket.ioWorkspaceAuth");

require("dotenv").config();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/user", user);
app.use("/api/workspace", workspace);
// app.use("/api/issue", issue);

const SocketIoIssue = require("./socket.ioRoutes/issue");
const { decodeJWT } = require("./helpers/jwt");
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Failed to connect to the database : ", error);
  });
io.use(SocketIoTokenAuth);
let onlineUsers = [];
io.on("connection", async (socket) => {
  const user = decodeJWT(socket.handshake?.auth?.accessToken);
  console.log(`${user.email} Connected`);
  socket.on("disconnect", () => {
    const disconnectUser = () => {
      let newArray = [...onlineUsers];
      newArray = newArray.filter((array_email) => {
        return array_email != user.email;
      });
      onlineUsers = newArray;
      if (!socket.rooms.has(socket.handshake?.auth?.url)) {
        socket.to(socket.handshake?.auth?.url).emit("user_offline", user.email);
      }
      console.log(`${user.email} disconnected`);
    };
    disconnectUser();
  });

  const response = await workspaceAuthSocketIo(
    socket.handshake?.auth?.accessToken,
    socket.handshake?.auth?.url
  );
  if (response !== 200) {
    joined(null, { message: response }, null);
    socket.disconnect();
    return;
  }
  onlineUsers = [...onlineUsers, user.email];
  const status = {
    joined: "yes",
    error: null,
    onlineUsers: onlineUsers,
  };
  socket.emit("joined_workspace", status);
  socket.join(socket.handshake?.auth?.url);
  console.log(`${user.email} Authorized`);
  socket.to(socket.handshake?.auth?.url).emit("user_online", user.email);
  SocketIoIssue(io, socket);
});
const port = 3000;

server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
