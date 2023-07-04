const mongoose = require("mongoose");
const issueSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  parent: {
    type: String,
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    required: true,
  },
});
const columnSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },
  issues: {
    type: [String],
  },
});
const workspaceSchema = new mongoose.Schema({
  url_id: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  image: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  members: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      role: {
        type: String,
        enum: ["admin", "member"],
        required: true,
      },
    },
  ],
  symbol: {
    type: String,
    required: true,
  },
  id_counter: {
    type: Number,
    default: 1,
  },
  issues: [issueSchema],
  columns: {
    type: [columnSchema],
    default: [
      {
        id: "backlog",
        title: "Backlog",
      },
      {
        id: "todo",
        title: "Todo",
      },
      {
        id: "inprogress",
        title: "In Progress",
      },
      {
        id: "done",
        title: "Done",
      },
    ],
  },
  columns_order: {
    type: [String],
    default: ["backlog", "todo", "inprogress", "done"],
  },
});

module.exports = mongoose.model("Workspace", workspaceSchema);
