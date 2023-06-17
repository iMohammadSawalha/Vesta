const jwt = require("jsonwebtoken");
const refreshTokenModel = require("../models/refreshToken");
const bcrypt = require("bcrypt");
const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" }); //short time for testing
};
const generateAccessRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
};

const fetchRefreshToken = async (userEmail) => {
  const result = await refreshTokenModel
    .findOne({ user_email: userEmail })
    .exec();
  if (!result) return false;
  return result.token;
};
const refreshTokenExists = async (token, userEmail) => {
  const hashedToken = await fetchRefreshToken(userEmail);
  if (!hashedToken) return false;
  return await compareRefreshToken(token, hashedToken);
};
const compareRefreshToken = async (token, hashedToken) => {
  const exists = await bcrypt.compare(token, hashedToken);
  return exists;
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

const loginToken = async (req, res) => {
  try {
    if (!req.body.user_email)
      return res.status(400).json({ error: "No user_email is provided" });
    const userEmail = req.body.user_email;
    const user = { user_email: userEmail };
    const accessToken = generateAccessToken(user);
    const refreshToken = generateAccessRefreshToken(user);
    await storeRefreshToken(refreshToken, userEmail);
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
  } catch {
    res.sendStatus(500);
  }
};

const authRefreshToken = async (req, res) => {
  try {
    const email = req.body.user_email;
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    if (!(await refreshTokenExists(refreshToken, email)))
      return res.sendStatus(403);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (error, user) => {
        if (error) return res.sendStatus(403);
        const accessToken = generateAccessToken({
          user_email: user.user_email,
        });
        res.json({ accessToken: accessToken });
      }
    );
  } catch {
    res.sendStatus(500);
  }
};

module.exports = { loginToken, authRefreshToken };
