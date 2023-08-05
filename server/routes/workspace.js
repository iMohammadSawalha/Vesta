const express = require("express");
const router = express.Router();
const {
  getWorkspace,
  createWorkspace,
  deleteWorkspace,
  invite,
} = require("../controllers/workspace");
const { authenticateToken } = require("../middleware/tokenAuth");
const { hasWrokspaceAccess } = require("../middleware/wrokspaceAuth");
router.use(authenticateToken);
router.post("/new", createWorkspace);
router.use(hasWrokspaceAccess);
router.post("/", getWorkspace);
router.post("/delete", deleteWorkspace);
router.post("/invite", hasWrokspaceAccess, invite);
module.exports = router;
