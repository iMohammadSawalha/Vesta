const express = require("express");
const { loginToken, authRefreshToken } = require("../controllers/auth");
const router = express.Router();

router.post("/login", loginToken);

router.post("/refreshtoken", authRefreshToken);

module.exports = router;
