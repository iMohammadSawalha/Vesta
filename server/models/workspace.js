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
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
});
const memberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "member"],
      required: true,
    },
  },
  { _id: false }
);
const columnSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    issues: {
      type: [String],
      ref: "Issue",
    },
  },
  { _id: false }
);
const workspaceSchema = new mongoose.Schema({
  url_id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  members: {
    type: [memberSchema],
    validate: {
      validator: function (array) {
        return array.length > 0;
      },
      message: "At least one member is required.",
    },
    required: true,
  },
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
