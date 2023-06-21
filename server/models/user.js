const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    workspaces: {
      type: [mongoose.ObjectId],
      ref: "Workspace",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
