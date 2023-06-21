const express = require("express");
const router = express.Router();
const { getWorkspace, createWorkspace } = require("../controllers/workspace");
const { authenticateToken } = require("../middleware/tokenAuth");
router.use(authenticateToken);

router.post("/", getWorkspace);
router.post("/new", createWorkspace);
module.exports = router;
