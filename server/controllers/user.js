const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isEmail, isPassword } = require("../helpers/regex");
const { isString } = require("../helpers/functions");
const userModel = require("../models/user");
const crypto = require("crypto");
const {
  storeRefreshToken,
  generateAccessToken,
  generateAccessRefreshToken,
  deleteRefreshToken,
} = require("./tokens");
const { getDefaultWorkspaceByEmailHelper } = require("./workspace");
const avatarGen = require("../helpers/avatarUrlGen");
const uploadImage = require("../api/cloudinary");
const { sendVerificationEmail } = require("./mail");
const delay = 1000 * 60 * 5;
const sentCodes = [];
const removeObjFromList = (list, email) => {
  const index = list.findIndex((obj) => obj.email === email);
  if (index > -1) list.splice(index, 1);
};
const sendCode = async (req, res) => {
  const email = req.body.email;
  if (!email && !isString(email) && !isEmail.test(email))
    return res.sendStatus(400);
  if (sentCodes.find((obj) => obj.email === email)) return res.sendStatus(401);
  const code = Math.random().toString(36).slice(-5);
  sendVerificationEmail(email, code);
  const sentCodeObj = {
    email,
    code,
  };
  sentCodes.push(sentCodeObj);
  setTimeout(removeObjFromList, delay, sentCodes, email);
  res.sendStatus(200);
};
const verifyCode = async (email, code) => {
  const sentCodeObj = sentCodes.find((obj) => {
    if (obj?.email === email && obj?.code === code) return true;
    return false;
  });
  if (sentCodeObj?.code !== code) return false;
  removeObjFromList(sentCodes, email);
  return true;
};
const register = async (req, res) => {
  let email = req.body.email;
  const password = req.body.password;
  const code = req.body.code;
  if (!code && !isString(code)) return res.sendStatus(400);
  if (!email || !password) return res.sendStatus(400);
  if (!isString(email, password)) return res.sendStatus(400);
  if (!isEmail.test(email) || !isPassword.test(password))
    return res.sendStatus(400);
  email = email.toLowerCase();
  if (!(await verifyCode(email, code))) return res.sendStatus(403);
  if (await findUserWithEmail(email)) return res.sendStatus(409);
  const salt = Number(process.env.PASSWORD_SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);
  let image = avatarGen({ name: email });
  if (req.body.image) {
    const imageUpload = await uploadImage(req.body.image);
    image = imageUpload.secure_url;
  }
  const user = new userModel({
    email,
    password: hashedPassword,
    image,
  });
  await user.save();
  res.sendStatus(201);
};

const findUserWithEmail = async (email) => {
  const result = await userModel.findOne({ email: email }).lean().exec();
  if (!result) return false;
  return result;
};

const login = async (req, res) => {
  try {
    let email = req.body.email;
    const password = req.body.password;
    if (!email || !password) return res.sendStatus(400);
    if (!isString(email, password)) return res.sendStatus(400);
    if (!isEmail.test(email)) return res.sendStatus(400);
    email = email.toLowerCase();
    const userFound = await findUserWithEmail(email);
    if (!userFound) return res.sendStatus(401);
    const matchPassword = await bcrypt.compare(password, userFound.password);
    if (!matchPassword) return res.sendStatus(401);
    const userEmail = email;
    const user = { email: userEmail };
    const accessToken = generateAccessToken(user);
    const refreshToken = generateAccessRefreshToken(user);
    const uuid = crypto.randomUUID();
    await storeRefreshToken(refreshToken, uuid);
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    res.cookie("uuid", uuid, {
      expires: expirationDate,
      secure: true,
      httpOnly: true,
      sameSite: "none",
    });
    res.cookie("refreshToken", refreshToken, {
      expires: expirationDate,
      secure: true,
      httpOnly: true,
      sameSite: "none",
    });
    const defaultWorkspace = await getDefaultWorkspaceByEmailHelper(userEmail);
    res.json({
      accessToken: accessToken,
      ...defaultWorkspace,
      user: {
        image: userFound.image,
        email: userFound.email,
      },
    });
  } catch {
    res.sendStatus(500);
  }
};

const logout = async (req, res) => {
  try {
    const cookies = req.cookies;
    const refreshToken = cookies?.refreshToken;
    const uuid = cookies?.uuid;
    if (!refreshToken) return res.sendStatus(204);
    await deleteRefreshToken(refreshToken, uuid);
    res.clearCookie("refreshToken", {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    });
    res.clearCookie("uuid", {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    });
    return res.sendStatus(204);
  } catch {
    res.sendStatus(500);
  }
};
const changeProfilePicture = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const imageData = req.body.image;
  if (!imageData) return res.sendStatus(400);
  if (!isString(imageData)) return res.sendStatus(400);
  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, user) => {
      if (error) return res.sendStatus(403);
      const email = user.email;
      const userData = await userModel.findOne({ email: email }).exec();
      if (!userData) return res.sendStatus(404);
      const imageUpload = await uploadImage(imageData);
      const imageURL = imageUpload.secure_url;
      if (!imageURL) return res.sendStatus(400);
      userData.image = imageURL;
      userData.save();
      res.status(201).json({ image: imageURL });
    });
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
};

module.exports = {
  login,
  register,
  logout,
  changeProfilePicture,
  sendCode,
  verifyCode,
};
