const express = require("express");
const app = express();
require("dotenv").config();
const auth = require("./routes/auth");
const { authenticateToken } = require("./middleware/tokenAuth");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const cors = require("cors");
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
  })
);

app.use("/api/auth", auth);

//       TESTING      //
const issues = [
  {
    user_email: "yaser",
    issues: "yaser issues",
  },
  {
    user_email: "ahmad@mohsen.com",
    issues: "ahmad issues",
  },
];
const data = {
  issues: {
    "LX-5": {
      status: "backlog",
      title: "Random Backlog Title 1",
      parent: "LB-1",
    },
    "LX-11": {
      status: "backlog",
      title: "Random Backlog Title 2",
      parent: "LB-1",
    },
    "LX-12": {
      status: "backlog",
      title: "Random Backlog Title 3",
      parent: "",
    },
    "LX-8": {
      status: "todo",
      title: "Random Todo Title 1",
      parent: "LB-3",
    },
    "LX-15": {
      status: "todo",
      title: "Random Todo Title 2",
      parent: "LB-2",
    },
    "LX-20": {
      status: "todo",
      title: "Random Todo Title 3",
      parent: "",
    },
    "LX-17": {
      status: "inprogress",
      title: "Random In Progress Title 1",
      parent: "LB-5",
    },
    "LX-22": {
      status: "inprogress",
      title: "Random In Progress Title 2",
      parent: "LB-4",
    },
    "LX-30": {
      status: "inprogress",
      title: "Random In Progress Title 3",
      parent: "",
    },
    "LX-25": {
      status: "done",
      title: "Random Done Title 1",
      parent: "LB-7",
    },
    "LX-33": {
      status: "done",
      title: "Random Done Title 2",
      parent: "LB-6",
    },
    "LX-40": {
      status: "done",
      title: "Random Done Title 3",
      parent: "",
    },
  },
  columns: {
    backlog: {
      title: "Backlog",
      issues: ["LX-5", "LX-11", "LX-12"],
    },
    todo: {
      title: "To Do",
      issues: ["LX-8", "LX-15", "LX-20"],
    },
    inprogress: {
      title: "In Progress",
      issues: ["LX-17", "LX-22", "LX-30"],
    },
    done: {
      title: "Done",
      issues: ["LX-25", "LX-33", "LX-40"],
    },
  },
  columnsOrder: ["backlog", "todo", "inprogress", "done"],
  idCounter: 50,
  idSymbol: "LX",
};
app.get("/data", authenticateToken, (req, res) => {
  res.json(data);
});
app.get("/issues", authenticateToken, (req, res) => {
  res.json(issues.filter((issue) => issue.user_email === req.user.user_email));
});

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

const port = 3000;

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
