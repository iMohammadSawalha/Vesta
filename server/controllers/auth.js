const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { isEmail, isPassword } = require("../helpers/regex");
const refreshTokenModel = require("../models/refreshToken");
const userModel = require("../models/user");

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

const login = async (req, res) => {
  try {
    //authentication here
    const email = req.body.email;
    if (!email) return res.status(400).json({ error: "No email is provided" });
    const userEmail = email;
    const user = { user_email: userEmail };
    const accessToken = generateAccessToken(user);
    const refreshToken = generateAccessRefreshToken(user);
    await storeRefreshToken(refreshToken, userEmail);
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
  } catch {
    res.sendStatus(500);
  }
};

const findUserWithEmail = async (email) => {
  const result = await userModel.findOne({ email: email }).exec();
  if (!result) return false;
  return result;
};

const register = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!isEmail.test(email)) return res.sendStatus(400);
  if (!isPassword.test(password)) return res.sendStatus(400);
  if (await findUserWithEmail(email)) return res.sendStatus(409);
  const salt = Number(process.env.PASSWORD_SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = new userModel({
    email,
    password: hashedPassword,
  });
  await user.save();
  res.sendStatus(201);
};

const authRefreshToken = async (req, res) => {
  try {
    const email = req.body.email;
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

module.exports = { login, authRefreshToken, register };
