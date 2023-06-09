import {
  DottedCircle,
  EmptyCircle,
  FullCircle,
  InProgressCircle,
} from "../components/icons";
const statusList = ["backlog", "todo", "inprogress", "done"];
const columnTitles = [
  <div className="issue-status-state">
    <DottedCircle sx={{ fontSize: 16, marginRight: 1 }} />
    <span>Backlog</span>
  </div>,
  <div className="issue-status-state">
    <EmptyCircle sx={{ fontSize: 16, marginRight: 1 }} />
    <span>To Do</span>
  </div>,
  <div className="issue-status-state">
    <InProgressCircle sx={{ fontSize: 16, marginRight: 1, color: "#fcca03" }} />
    <span>In Progress</span>
  </div>,
  <div className="issue-status-state">
    <FullCircle sx={{ fontSize: 16, marginRight: 1, color: "#ac40fe" }} />
    <span>Done</span>
  </div>,
];
const modulesQuill = {
  toolbar: [
    [{ header: [1, 2, 3] }, { font: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["clean"],
    ["code-block"],
  ],
};
const formatsQuill = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "code-block",
];
const notEmptyString = /^(?!\s*$).+/;
const isEmail = /\S+@\S+\.\S+/;
const isPassword = /^[^\s]{8,}$/; //has at least 8 chars
const isValidWorkspaceName = /^[a-zA-Z]{3,}$/; // has at least 3 letters
export {
  statusList,
  columnTitles,
  modulesQuill,
  formatsQuill,
  notEmptyString,
  isEmail,
  isPassword,
  isValidWorkspaceName,
};
