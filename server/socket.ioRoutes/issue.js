const {
  moveIssue,
  addIssue,
  editIssue,
  deleteIssue,
  changeAssignee,
} = require("../controllers/scoket.ioIssue");
module.exports = (io, socket) => {
  const room = socket.handshake?.auth?.url;
  socket.on("add_issue", async (data, errorCallback) => {
    if (!socket.rooms.has(room)) return errorCallback({ message: 403 });
    const response = await addIssue(data);
    if (response === 201) {
      io.sockets.in(room).emit("add_issue", data);
    } else {
      errorCallback({ message: response });
    }
  });
  socket.on("move_issue", async (data, errorCallback) => {
    if (!socket.rooms.has(room)) return errorCallback({ message: 403 });
    const response = await moveIssue(data);
    if (response === 204) {
      io.sockets.in(room).emit("move_issue", data);
    } else {
      errorCallback({ message: response });
    }
  });
  socket.on("change_assignee", async (data, errorCallback) => {
    if (!socket.rooms.has(room)) return errorCallback({ message: 403 });
    const response = await changeAssignee(
      data,
      socket.handshake?.auth?.accessToken
    );
    if (response.status === 204) {
      io.sockets
        .in(room)
        .emit("change_assignee", { ...response.data, issueId: data.issue.id });
    } else {
      errorCallback({ message: response.status });
    }
  });
  socket.on("edit_issue", async (data, errorCallback) => {
    if (!socket.rooms.has(room)) return errorCallback({ message: 403 });
    const response = await editIssue(data);
    if (response === 204) {
      io.sockets.in(room).emit("edit_issue", data);
    } else {
      errorCallback({ message: response });
    }
  });
  socket.on("delete_issue", async (data, errorCallback) => {
    if (!socket.rooms.has(room)) return 403;
    const response = await deleteIssue(data);
    if (response === 204) {
      io.sockets.in(room).emit("delete_issue", data);
    } else {
      errorCallback({ message: response });
      s;
    }
  });
};
