const jwt = require("jsonwebtoken");
const workspaceModel = require("../models/workspace");

const getWorkspace = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const workspaceUrl = req.body.url;
    if (!workspaceUrl) return res.sendStatus(400);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, user) => {
      if (error) return res.sendStatus(403);
      const email = user.email;
      const workspaceData = await workspaceModel
        .findOne({ url_id: workspaceUrl }, { _id: false, __v: false })
        .lean()
        .exec();
      if (!workspaceData) return res.sendStatus(404);
      const isMember = workspaceData.members.some(
        (user) => user.email === email
      );
      if (!isMember) return res.sendStatus(403);
      res.json(workspaceData);
    });
  } catch {
    res.sendStatus(500);
  }
};

const createWorkspace = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const { url, name, symbol } = req.body;
    if (!url || !name || !symbol) return res.sendStatus(400);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, user) => {
      if (error) return res.sendStatus(403);
      const email = user.email;
      const foundWorkspace = await workspaceModel
        .findOne({ url_id: url })
        .lean()
        .exec();
      if (foundWorkspace) return res.sendStatus(409);
      const ownerMember = {
        email: email,
        role: "admin",
      };
      await workspaceModel
        .create({
          url_id: url,
          name,
          symbol,
          members: ownerMember,
        })
        .then(() => {
          res.sendStatus(201);
        })
        .catch(() => {
          res.sendStatus(500);
        });
    });
  } catch {
    res.sendStatus(500);
  }
};

module.exports = { getWorkspace, createWorkspace };
