const refreshTokenModel = require("../models/refreshToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/user");
const { getDefaultWorkspaceByEmailHelper } = require("./workspace");

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" }); //short time for testing
};
const generateAccessRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
};

const deleteRefreshToken = async (token, uuid) => {
  const found = await refreshTokenExists(token, uuid);
  if (!found) return;
  await refreshTokenModel.deleteOne({ uuid: uuid });
};

const fetchRefreshToken = async (uuid) => {
  const result = await refreshTokenModel.findOne({ uuid: uuid }).exec();
  if (!result) return false;
  return result;
};
const refreshTokenExists = async (token, uuid) => {
  const data = await fetchRefreshToken(uuid);
  if (!data) return false;
  return await compareRefreshToken(token, data.token);
};
const compareRefreshToken = async (token, hashedToken) => {
  const exists = await bcrypt.compare(token, hashedToken);
  return exists;
};
const authRefreshToken = async (req, res) => {
  try {
    const cookies = req.cookies;
    const refreshToken = cookies?.refreshToken;
    const uuid = cookies?.uuid;
    if (!refreshToken) return res.sendStatus(401);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (error, user) => {
        if (error) return res.sendStatus(403);
        const email = user.email;
        if (!(await refreshTokenExists(refreshToken, uuid)))
          return res.sendStatus(403);
        const accessToken = generateAccessToken({
          email: email,
        });
        const defaultWorkspace = await getDefaultWorkspaceByEmailHelper(email);
        const userData = await userModel
          .findOne({ email: email })
          .lean()
          .exec();
        res.json({
          accessToken: accessToken,
          ...defaultWorkspace,
          user: {
            image: userData.image,
            email: userData.email,
          },
        });
      }
    );
  } catch {
    res.sendStatus(500);
  }
};

const storeRefreshToken = async (token, uuid) => {
  const salt = Number(process.env.TOKEN_HASH_SALT_ROUNDS);
  const hashedRefreshToken = await bcrypt.hash(token, salt);
  const refreshToken = new refreshTokenModel({
    uuid: uuid,
    token: hashedRefreshToken,
  });
  await refreshToken.save();
};

module.exports = {
  generateAccessToken,
  generateAccessRefreshToken,
  storeRefreshToken,
  authRefreshToken,
  deleteRefreshToken,
};
