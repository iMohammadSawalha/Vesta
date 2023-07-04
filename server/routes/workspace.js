const express = require("express");
const router = express.Router();
const {
  getWorkspace,
  createWorkspace,
  deleteWorkspace,
} = require("../controllers/workspace");
const { authenticateToken } = require("../middleware/tokenAuth");
router.use(authenticateToken);

router.post("/", getWorkspace);
router.post("/new", createWorkspace);
router.post("/delete", deleteWorkspace);
module.exports = router;
