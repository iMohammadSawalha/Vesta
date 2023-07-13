const jwt = require("jsonwebtoken");
module.exports = (socket, next) => {
  try {
    const token = socket.handshake?.auth?.accessToken;
    if (token == null) return next(new Error(401));
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
      if (error) return next(new Error(403));
      next();
    });
  } catch {
    next(new Error(500));
  }
};
