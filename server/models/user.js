const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    workspaces: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Workspace",
    },
    default_workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
