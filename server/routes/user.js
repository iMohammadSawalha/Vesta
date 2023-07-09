const express = require("express");
const {
  login,
  register,
  logout,
  changeProfilePicture,
} = require("../controllers/user");
const { authRefreshToken } = require("../controllers/tokens");
const { authenticateToken } = require("../middleware/tokenAuth");
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.post("/refreshtoken", authRefreshToken);
router.use(authenticateToken);
router.post("/update-picture", changeProfilePicture);

module.exports = router;
