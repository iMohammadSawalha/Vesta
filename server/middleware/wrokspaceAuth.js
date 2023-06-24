const jwt = require("jsonwebtoken");
const workspaceModel = require("../models/workspace");
const hasWrokspaceAccess = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const workspaceUrl = req.body.url;
    if (!workspaceUrl) return res.sendStatus(400);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, user) => {
      if (error) return res.sendStatus(403);
      const email = user.email;
      const workspaceData = await workspaceModel
        .findOne({ url_id: workspaceUrl }, { _id: false, __v: false })
        .lean()
        .exec();
      if (!workspaceData) return res.sendStatus(404);
      const isMember = workspaceData.members.some(
        (user) => user.email === email
      );
      if (!isMember) return res.sendStatus(403);
      next();
    });
  } catch {
    res.sendStatus(500);
  }
};
module.exports = { hasWrokspaceAccess };
