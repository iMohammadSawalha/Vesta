const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
  user_email: {
    type: String,
    required: true,
    lowercase: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 604800, //604800 = 7 Days
    default: Date.now,
  },
});

module.exports = mongoose.model("Refresh_token", refreshTokenSchema);
