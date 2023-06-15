import { Link, useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import {
  modulesQuill,
  formatsQuill,
  statusList,
  notEmptyString,
} from "../helpers/global";
import { useState } from "react";
import StatusList from "./issueStatusMenu";
import { Alert, Avatar, Chip } from "@mui/material";
import { Plus } from "./icons";
import DeleteIssueModal from "./deleteIssueModal";
const IssueBigScreen = ({ issues, updateIssues }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState(() => {
    if (issues.issues[id]) return issues.issues[id].title;
  });
  const [description, setDescription] = useState(() => {
    if (issues.issues[id]) return issues.issues[id].description;
  });
  const [titleRequired, setTitleRequired] = useState(false);
  const columns = Object.keys(issues.columns);
  let columnStatus = "";
  columns.map((column) => {
    if (issues.columns[column].issues.includes(id)) columnStatus = column;
  });
  const [selectedIndex, setSelectedIndex] = useState(
    statusList.indexOf(columnStatus)
  );

  const saveNewIssue = () => {
    if (!notEmptyString.test(title)) {
      if (!titleRequired) {
        setTitleRequired(true);
        const alertTimeOut = setTimeout(() => {
          setTitleRequired(false);
          clearTimeout(alertTimeOut);
        }, 5000);
      }
      return;
    }
    //TODO
    if (!parent) {
      var parentid = "";
    }
    updateIssues((prevState) => {
      const newState = JSON.parse(JSON.stringify(prevState));
      newState.issues[id].title = title;
      newState.issues[id].description = description;
      newState.issues[id].parent = parentid;
      if (statusList[selectedIndex] != newState.issues[id].status) {
        newState.columns[newState.issues[id].status].issues.splice(
          newState.columns[newState.issues[id].status].issues.indexOf(id),
          1
        );
        newState.columns[statusList[selectedIndex]].issues.splice(0, 0, id);
        newState.issues[id].status = statusList[selectedIndex];
      }
      return newState;
    });
    navigate(-1);
  };
  return (
    <div className="big-screen-issue">
      <div className="big-screen-issue-content">
        <div className="big-screen-issue-header">
          <Chip
            variant="outlined"
            avatar={
              <Avatar
                sx={{
                  backgroundColor: "transparent",
                  borderRight: "1px solid white",
                }}
              >
                <div
                  style={{
                    color: "#dbdbdb",
                    marginTop: "auto",
                    marginBottom: "5px",
                  }}
                >
                  {issues.idSymbol}
                </div>
              </Avatar>
            }
            label={id.slice(id.indexOf("-") + 1)}
            sx={{ color: "#dbdbdb" }}
          />
          <DeleteIssueModal
            id={id}
            updateIssues={updateIssues}
            issues={issues}
          />
          <div className="exit-big-screen-issue">
            <Link to={-1}>
              <button className="exit-add-issue-modal-button">
                <Plus sx={{ transform: "rotate(45deg)" }} />
              </button>
            </Link>
          </div>
        </div>
        <input
          className="new-issue-input-placeholder"
          placeholder="Issue title"
          autoFocus
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <div className="new-issue-description-placeholder">
          <ReactQuill
            formats={formatsQuill}
            modules={modulesQuill}
            theme="snow"
            value={description}
            onChange={setDescription}
            placeholder="Description"
            preserveWhitespace
          />
        </div>
        <div className="big-issue-buttons">
          <div className="status-menu-selector-button">
            <StatusList
              setSelectedIndex={setSelectedIndex}
              selectedIndex={selectedIndex}
            />
          </div>
          {titleRequired && (
            <Alert
              severity="warning"
              sx={{
                borderRadius: "20px",
                backgroundColor: "white",
                marginRight: "5px",
              }}
            >
              Title is required !
            </Alert>
          )}
          <button className="new-issue-save-button" onClick={saveNewIssue}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
export default IssueBigScreen;
