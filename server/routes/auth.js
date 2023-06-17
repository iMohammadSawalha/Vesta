const express = require("express");
const { login, authRefreshToken, register } = require("../controllers/auth");
const router = express.Router();

router.post("/login", login);
router.post("/register", register);

router.post("/refreshtoken", authRefreshToken);

module.exports = router;
