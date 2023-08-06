const jwt = require("jsonwebtoken");
const workspaceModel = require("../models/workspace");
const { isString } = require("../helpers/functions");
const workspaceAuthSocketIo = async (token, workspaceUrl) => {
  try {
    if (!workspaceUrl || !token) return 400;
    if (!isString(workspaceUrl, token)) return 400;
    return jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (error, user) => {
        if (error) return 403;
        const email = user.email;
        const workspaceData = await workspaceModel
          .findOne({ url_id: workspaceUrl })
          .populate("members.user", "email")
          .lean()
          .exec();
        if (!workspaceData) return 404;
        const isMember = workspaceData.members.some(
          (member) => member.user.email === email
        );
        if (!isMember) return 403;
        return 200;
      }
    );
  } catch {
    return 500;
  }
};
module.exports = { workspaceAuthSocketIo };
