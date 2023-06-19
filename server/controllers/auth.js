const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isEmail, isPassword } = require("../helpers/regex");
const userModel = require("../models/user");
const {
  storeRefreshToken,
  generateAccessToken,
  generateAccessRefreshToken,
  deleteRefreshToken,
} = require("./tokens");

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

const findUserWithEmail = async (email) => {
  const result = await userModel.findOne({ email: email }).exec();
  if (!result) return false;
  return result;
};

const login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (!isEmail.test(email)) return res.sendStatus(400);
    const userFound = await findUserWithEmail(email);
    if (!userFound) return res.sendStatus(401);
    const matchPassword = await bcrypt.compare(password, userFound.password);
    if (!matchPassword) return res.sendStatus(401);
    const userEmail = email;
    const user = { user_email: userEmail };
    const accessToken = generateAccessToken(user);
    const refreshToken = generateAccessRefreshToken(user);
    await storeRefreshToken(refreshToken, userEmail);
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    res.cookie("refreshToken", refreshToken, {
      expires: expirationDate,
      httpOnly: true,
    });
    res.json({ accessToken: accessToken });
  } catch {
    res.sendStatus(500);
  }
};

const logout = async (req, res) => {
  try {
    const cookies = req.cookies;
    const refreshToken = cookies?.refreshToken;
    if (!refreshToken) return res.sendStatus(204);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (error, user) => {
        if (error) {
          res.clearCookie("refreshToken", { httpOnly: true });
          return res.sendStatus(204);
        }
        const email = user.user_email;
        await deleteRefreshToken(refreshToken, email);
        res.clearCookie("refreshToken", { httpOnly: true });
        return res.sendStatus(204);
      }
    );
  } catch {
    res.sendStatus(500);
  }
};

module.exports = { login, register, logout };
