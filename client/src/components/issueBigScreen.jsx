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
import useAuth from "../hooks/useAuth";
import IssueNotFound from "./issueNotFound";
import IssueAssigneeMenu from "./issueAssignee";
import userImage from "../assets/images/user.png";
const IssueBigScreen = () => {
  const navigate = useNavigate();
  const { issues, socket } = useAuth();
  const { id, url } = useParams();
  const issueObj = issues.issues.find((issue) => issue.id === id);
  const [title, setTitle] = useState(issueObj?.title);
  const [description, setDescription] = useState(issueObj?.description);
  const [titleRequired, setTitleRequired] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(
    statusList.indexOf(issueObj?.status)
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const errorHandler = (error) => {
    console.log(error.message);
  };
  const homeUrl = "/" + url;
  const saveIssueRequest = () => {
    try {
      socket.emit(
        "edit_issue",
        {
          url: url,
          issue: {
            id: id,
            title: title,
            description: description,
            status: statusList[selectedIndex],
          },
        },
        errorHandler
      );
      navigate(homeUrl);
    } catch (error) {
      //TODO ERROR MESSAGE HANDLE
      console.log(error);
    }
  };
  const saveNewIssue = async () => {
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
    saveIssueRequest();
  };
  if (!issueObj) return <IssueNotFound id={id} />;
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
                  {issues.symbol}
                </div>
              </Avatar>
            }
            label={id?.slice(id?.indexOf("-") + 1)}
            sx={{ color: "#dbdbdb" }}
          />
          <DeleteIssueModal />
          <div className="exit-big-screen-issue">
            <Link to={homeUrl}>
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
          <IssueAssigneeMenu
            id={id}
            width={30}
            height={30}
            setAnchorEl={setAnchorEl}
            anchorEl={anchorEl}
            menuButton={
              <div
                className="issue-assignee-menu-big-screen"
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                <div>
                  <img
                    width={30}
                    height={30}
                    src={issueObj?.assignee?.image || userImage}
                  />
                </div>
                <span
                  className="assignee-menu-text-holder"
                  style={{ marginLeft: "0.5rem" }}
                >
                  {issueObj?.assignee?.email
                    ? issueObj?.assignee?.email
                    : "Unassinged"}
                </span>
              </div>
            }
          />
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
