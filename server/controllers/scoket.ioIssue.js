const { isInteger } = require("../helpers/regex");
const workspaceModel = require("../models/workspace");
const userModel = require("../models/user");
const { isObjectIdValid } = require("../helpers/mongoose");
const { decodeJWT } = require("../helpers/jwt");
const addIssue = async (data) => {
  try {
    const workspaceUrl = data.url;
    const newIssue = data.issue;
    if (!newIssue || !newIssue.id || !newIssue.title || !newIssue.status)
      return 400;
    const workspace = await workspaceModel
      .findOne({ url_id: workspaceUrl })
      .exec();
    if (workspace.issues.find((issue) => issue.id === newIssue.id)) return 409;
    workspace.issues.push(newIssue);
    const columnToUpdate = workspace.columns.find(
      (column) => column.id === newIssue.status
    );
    columnToUpdate.issues.push(newIssue.id);
    workspace.id_counter += 1;
    workspace.save();
    return 201;
  } catch {
    return 500;
  }
};

const moveIssue = async (data) => {
  try {
    const workspaceUrl = data.url;
    const { id, sColumn, sIndex, dColumn, dIndex } = data;
    if (
      !id ||
      !sColumn ||
      !isInteger.test(sIndex) ||
      !dColumn ||
      !isInteger.test(dIndex)
    )
      return 400;
    const workspace = await workspaceModel
      .findOne({ url_id: workspaceUrl })
      .exec();
    const issueToUpdate = workspace.issues.find((issue) => issue.id === id);
    if (!issueToUpdate) return 404;
    const fromColumn = workspace.columns.find(
      (column) => column.id === sColumn
    );
    if (fromColumn.issues.indexOf(id) !== sIndex) return 400;
    fromColumn.issues.splice(sIndex, 1);
    if (sColumn != dColumn) {
      const toColumn = workspace.columns.find(
        (column) => column.id === dColumn
      );
      toColumn.issues.splice(dIndex, 0, id);
      issueToUpdate.status = dColumn;
    } else {
      fromColumn.issues.splice(dIndex, 0, id);
    }
    workspace.save();
    return 204;
  } catch {
    return 500;
  }
};
const editIssue = async (data) => {
  try {
    const workspaceUrl = data.url;
    const newIssue = data.issue;
    if (!newIssue || !newIssue.id) return 400;
    if (newIssue.assignee) if (!isObjectIdValid(newIssue.assignee)) return 400;
    const workspace = await workspaceModel
      .findOne({ url_id: workspaceUrl })
      .exec();
    const issueToUpdate = workspace.issues.find(
      (issue) => issue.id === newIssue.id
    );
    if (!issueToUpdate) return 404;
    if (newIssue.status)
      if (newIssue.status !== issueToUpdate.status) {
        const columnToUpdateFrom = workspace.columns.find(
          (column) => column.id === issueToUpdate.status
        );
        columnToUpdateFrom.issues.splice(
          columnToUpdateFrom.issues.indexOf(newIssue.id),
          1
        );
        const columnToUpdateTo = workspace.columns.find(
          (column) => column.id === newIssue.status
        );
        columnToUpdateTo.issues.splice(0, 0, newIssue.id);
      }
    Object.assign(issueToUpdate, newIssue);
    workspace.save();
    return 204;
  } catch {
    return 500;
  }
};
const changeAssignee = async (data, token) => {
  const editResponse = await editIssue(data);
  if (editResponse !== 204) return { status: editResponse };
  if (!data.issue.assignee)
    return {
      status: 204,
      data: null,
    };
  try {
    const user = decodeJWT(token);
    const email = user.email;
    if (!email) return { status: 400 };
    const userData = await userModel
      .findById(data.issue.assignee)
      .lean()
      .exec();
    if (!userData) return { status: 400 };
    return {
      status: 204,
      data: { _id: userData._id, email: userData.email, image: userData.image },
    };
  } catch {
    return { status: 500 };
  }
};
const deleteIssue = async (data) => {
  try {
    const workspaceUrl = data.url;
    const id = data.id;
    if (!id) return 400;
    const workspace = await workspaceModel
      .findOne({ url_id: workspaceUrl })
      .exec();
    const issueToUpdate = workspace.issues.find((issue) => issue.id === id);
    if (!issueToUpdate) return 404;
    const columnToUpdate = workspace.columns.find(
      (column) => column.id === issueToUpdate.status
    );
    const indexInIssues = workspace.issues.findIndex(
      (issue) => issue.id === id
    );
    const indexInColumn = columnToUpdate.issues.indexOf(id);
    if (indexInIssues === -1 || indexInColumn === -1) return 404;
    columnToUpdate.issues.splice(indexInColumn, 1);
    workspace.issues.splice(indexInIssues, 1);
    workspace.save();
    return 204;
  } catch {
    return 500;
  }
};
module.exports = {
  moveIssue,
  addIssue,
  editIssue,
  deleteIssue,
  changeAssignee,
};
