const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
  user_email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 60, //short time for testing
    default: Date.now,
  },
});

module.exports = mongoose.model("Refresh_token", refreshTokenSchema);
