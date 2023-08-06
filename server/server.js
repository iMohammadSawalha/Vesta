const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
app.use(
  cors({
    credentials: true,
    origin: JSON.parse(process.env.ORIGINS),
  })
);
const io = new Server(server, {
  cors: {
    origin: JSON.parse(process.env.ORIGINS),
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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/user", user);
app.use("/api/workspace", workspace);
// app.use("/api/issue", issue);

const SocketIoIssue = require("./socket.ioRoutes/issue");
const { isString } = require("./helpers/functions");
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
  socket.on("disconnect", () => {
    const disconnectUser = () => {
      let newArray = [...onlineUsers];
      const index = newArray.indexOf(user.email);
      newArray.splice(index, 1);
      onlineUsers = newArray;
      if (!socket.rooms.has(socket.handshake?.auth?.url)) {
        socket.to(socket.handshake?.auth?.url).emit("onlineList", onlineUsers);
      }
      console.log(`${user.email} Disconnected`);
    };
    disconnectUser();
  });
  if (
    !isString(socket.handshake?.auth?.accessToken, socket.handshake?.auth?.url)
  ) {
    socket.disconnect();
    return;
  }
  const user = jwt.decode(socket.handshake?.auth?.accessToken);
  console.log(`${user?.email} Connected`);
  const response = await workspaceAuthSocketIo(
    socket.handshake?.auth?.accessToken,
    socket.handshake?.auth?.url
  );
  if (response !== 200) {
    socket.disconnect();
    return;
  }
  onlineUsers = [...onlineUsers, user.email];
  socket.emit("onlineList", onlineUsers);
  socket.join(socket.handshake?.auth?.url);
  socket.to(socket.handshake?.auth?.url).emit("onlineList", onlineUsers);
  SocketIoIssue(io, socket);
});
const port = 3000;

server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
