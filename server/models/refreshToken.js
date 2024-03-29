const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
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
