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

const deleteRefreshToken = async (token, userEmail) => {
  const found = await refreshTokenExists(token, userEmail);
  if (!found) return;
  await refreshTokenModel.deleteOne({ user_email: userEmail });
};

const fetchRefreshToken = async (userEmail) => {
  const result = await refreshTokenModel
    .findOne({ user_email: userEmail })
    .exec();
  if (!result) return false;
  return result;
};
const refreshTokenExists = async (token, userEmail) => {
  const data = await fetchRefreshToken(userEmail);
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
    if (!refreshToken) return res.sendStatus(401);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (error, user) => {
        if (error) return res.sendStatus(403);
        const email = user.email;
        if (!(await refreshTokenExists(refreshToken, email)))
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

const storeRefreshToken = async (token, userEmail) => {
  const salt = Number(process.env.TOKEN_HASH_SALT_ROUNDS);
  const hashedRefreshToken = await bcrypt.hash(token, salt);
  const refreshToken = new refreshTokenModel({
    user_email: userEmail,
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
