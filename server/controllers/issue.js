// const { isInteger } = require("../helpers/regex");
// const workspaceModel = require("../models/workspace");
// const { isObjectIdValid } = require("../helpers/mongoose");
// const addIssue = async (req, res) => {
//   try {
//     const workspaceUrl = req.body.url;
//     const newIssue = req.body.issue;
//     if (!newIssue || !newIssue.id || !newIssue.title || !newIssue.status)
//       return res.sendStatus(400);
//     const workspace = await workspaceModel
//       .findOne({ url_id: workspaceUrl })
//       .exec();
//     if (workspace.issues.find((issue) => issue.id === newIssue.id))
//       return res.sendStatus(409);
//     workspace.issues.push(newIssue);
//     const columnToUpdate = workspace.columns.find(
//       (column) => column.id === newIssue.status
//     );
//     columnToUpdate.issues.push(newIssue.id);
//     workspace.id_counter += 1;
//     workspace.save();
//     res.sendStatus(201);
//   } catch {
//     res.sendStatus(500);
//   }
// };

// const editIssue = async (req, res) => {
//   try {
//     const workspaceUrl = req.body.url;
//     const newIssue = req.body.issue;
//     if (!newIssue || !newIssue.id) return res.sendStatus(400);
//     if (newIssue.assignee)
//       if (!isObjectIdValid(newIssue.assignee)) return res.sendStatus(400);
//     const workspace = await workspaceModel
//       .findOne({ url_id: workspaceUrl })
//       .exec();
//     const issueToUpdate = workspace.issues.find(
//       (issue) => issue.id === newIssue.id
//     );
//     if (!issueToUpdate) return res.sendStatus(404);
//     if (newIssue.status)
//       if (newIssue.status !== issueToUpdate.status) {
//         const columnToUpdateFrom = workspace.columns.find(
//           (column) => column.id === issueToUpdate.status
//         );
//         columnToUpdateFrom.issues.splice(
//           columnToUpdateFrom.issues.indexOf(newIssue.id),
//           1
//         );
//         const columnToUpdateTo = workspace.columns.find(
//           (column) => column.id === newIssue.status
//         );
//         columnToUpdateTo.issues.splice(0, 0, newIssue.id);
//       }
//     Object.assign(issueToUpdate, newIssue);
//     workspace.save();
//     res.sendStatus(204);
//   } catch {
//     res.sendStatus(500);
//   }
// };
// const moveIssue = async (req, res) => {
//   try {
//     const workspaceUrl = req.body.url;
//     const { id, sColumn, sIndex, dColumn, dIndex } = req.body;
//     if (
//       !id ||
//       !sColumn ||
//       !isInteger.test(sIndex) ||
//       !dColumn ||
//       !isInteger.test(dIndex)
//     )
//       return res.sendStatus(400);
//     const workspace = await workspaceModel
//       .findOne({ url_id: workspaceUrl })
//       .exec();
//     const issueToUpdate = workspace.issues.find((issue) => issue.id === id);
//     if (!issueToUpdate) return res.sendStatus(404);
//     const fromColumn = workspace.columns.find(
//       (column) => column.id === sColumn
//     );
//     if (fromColumn.issues.indexOf(id) !== sIndex) return res.sendStatus(400);
//     fromColumn.issues.splice(sIndex, 1);
//     if (sColumn != dColumn) {
//       const toColumn = workspace.columns.find(
//         (column) => column.id === dColumn
//       );
//       toColumn.issues.splice(dIndex, 0, id);
//       issueToUpdate.status = dColumn;
//     } else {
//       fromColumn.issues.splice(dIndex, 0, id);
//     }
//     workspace.save();
//     res.sendStatus(204);
//   } catch {
//     res.sendStatus(500);
//   }
// };

// const deleteIssue = async (req, res) => {
//   try {
//     const workspaceUrl = req.body.url;
//     const id = req.body.id;
//     if (!id) return res.sendStatus(400);
//     const workspace = await workspaceModel
//       .findOne({ url_id: workspaceUrl })
//       .exec();
//     const issueToUpdate = workspace.issues.find((issue) => issue.id === id);
//     if (!issueToUpdate) return res.sendStatus(404);
//     const columnToUpdate = workspace.columns.find(
//       (column) => column.id === issueToUpdate.status
//     );
//     const indexInIssues = workspace.issues.findIndex(
//       (issue) => issue.id === id
//     );
//     const indexInColumn = columnToUpdate.issues.indexOf(id);
//     if (indexInIssues === -1 || indexInColumn === -1)
//       return res.sendStatus(404);
//     columnToUpdate.issues.splice(indexInColumn, 1);
//     workspace.issues.splice(indexInIssues, 1);
//     workspace.save();
//     res.sendStatus(204);
//   } catch {
//     res.sendStatus(500);
//   }
// };
// module.exports = { addIssue, editIssue, moveIssue, deleteIssue };
