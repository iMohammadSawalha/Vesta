const express = require("express");
const { login, register, logout } = require("../controllers/auth");
const { authRefreshToken } = require("../controllers/tokens");
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.post("/refreshtoken", authRefreshToken);

module.exports = router;
