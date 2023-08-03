const jwt = require("jsonwebtoken");
const workspaceModel = require("../models/workspace");
const userModel = require("../models/user");
const avatarGen = require("../helpers/avatarUrlGen");
const { isEmail } = require("../helpers/regex");

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
        .findOne({ url_id: workspaceUrl })
        .populate([
          { path: "members.user", select: "email image" },
          { path: "issues.assignee", select: "email image" },
        ])
        .lean()
        .exec();
      if (!workspaceData) return res.status(404).json({ error: "NotFound" });
      const isMember = workspaceData.members.some(
        (member) => member.user.email === email
      );
      if (!isMember) return res.status(403).json({ error: "NotMember" });
      res.json(workspaceData);
      try {
        const userDoc = await userModel.findOne({ email: email }).exec();
        if (!userDoc) return;
        userDoc.default_workspace = workspaceData._id;
        userDoc.save();
      } catch {
        console.error(error);
      }
    });
  } catch {
    res.sendStatus(500);
  }
};

const createWorkspace = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const { url, name } = req.body;
    const symbol = name?.slice(0, 2).toUpperCase();
    if (!url || !name || !symbol) return res.sendStatus(400);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, user) => {
      if (error) return res.sendStatus(403);
      const email = user.email;
      const foundWorkspace = await workspaceModel
        .findOne({ url_id: url })
        .lean()
        .exec();
      if (foundWorkspace) return res.sendStatus(409);
      const userData = await userModel.findOne({ email: email }).exec();
      const ownerMember = {
        user: userData._id,
        role: "admin",
      };
      const image = avatarGen({ name: name });
      const newWorkspace = await workspaceModel.create({
        url_id: url,
        name,
        symbol,
        members: ownerMember,
        image,
      });
      try {
        const userDoc = await userModel.findOne({ email: email }).exec();
        if (!userDoc) return res.sendStatus(422);
        userDoc.default_workspace = newWorkspace._id;
        userDoc.workspaces.push(newWorkspace._id);
        await userDoc.save();
        res.status(201).json(await getDefaultWorkspaceByEmailHelper(email));
      } catch {
        res.sendStatus(500);
      }
    });
  } catch {
    res.sendStatus(500);
  }
};

const getDefaultWorkspaceByEmailHelper = async (email) => {
  try {
    if (!email) return;
    const userData = await userModel
      .findOne({ email: email })
      .populate([
        { path: "default_workspace", select: "url_id name image" },
        { path: "workspaces", select: "url_id name image" },
      ])
      .lean()
      .exec();
    if (!userData?.default_workspace || !userData?.workspaces) return;
    return {
      defaultWorkspace: userData.default_workspace,
      workspaces: userData.workspaces,
    };
  } catch {
    console.error(error);
  }
};

const deleteWorkspace = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const { url } = req.body;
    if (!url) return res.sendStatus(400);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, user) => {
      if (error) return res.sendStatus(403);
      const workspaceData = await workspaceModel
        .findOne({ url_id: url })
        .populate("members.user", "email")
        .lean()
        .exec();
      if (!workspaceData) return res.sendStatus(404);
      const membersEmails = workspaceData.members.map(
        (member) => member.user.email
      );
      membersEmails.map(async (email) => {
        try {
          const userDoc = await userModel
            .findOne({ email: email })
            .populate([
              { path: "workspaces", select: "url_id" },
              { path: "default_workspace", select: "url_id" },
            ])
            .exec();
          if (!userDoc) return;
          const indexOfWorkspace = userDoc.workspaces.findIndex(
            (ws) => ws.url_id === url
          );
          const tempWorkspaces = userDoc.workspaces[0]?.url_id;
          const tempDefaultWorkspace = JSON.parse(
            JSON.stringify(userDoc.default_workspace)
          );
          userDoc.depopulate("default_workspace workspaces");
          userDoc.workspaces.splice(indexOfWorkspace, 1);
          if (tempDefaultWorkspace.url_id === url)
            if (tempWorkspaces) {
              userDoc.default_workspace = userDoc.workspaces[0];
            } else {
              userDoc.default_workspace = null;
            }
          userDoc.markModified("workspaces");
          await userDoc.save();
          await workspaceModel.deleteOne({ url_id: url });
          res.sendStatus(204);
        } catch {
          res.sendStatus(500);
        }
      });
    });
  } catch {
    res.sendStatus(500);
  }
};
const invite = async (req, res) => {
  try {
    const email = req.body.email;
    const url = req.body.url;
    if (!email) return res.sendStatus(400);
    if (!url) return res.sendStatus(400);
    if (!isEmail.test(email)) return res.sendStatus(400);
    const userData = await userModel.findOne({ email: email }).exec();
    const workspaceData = await workspaceModel
      .findOne({ url_id: url })
      .populate([{ path: "members.user", select: "email" }])
      .exec();
    const isMember = workspaceData.members.some(
      (member) => member.user.email === email
    );
    if (isMember) return res.sendStatus(200);
    workspaceData.depopulate("members.user");
    workspaceData.members.push({ user: userData._id, role: "member" });
    userData.workspaces.push(workspaceData._id);
    await userData.save();
    await workspaceData.save();
    res.sendStatus(201);
  } catch {
    res.sendStatus(500);
  }
};
module.exports = {
  getWorkspace,
  createWorkspace,
  getDefaultWorkspaceByEmailHelper,
  deleteWorkspace,
  invite,
};
