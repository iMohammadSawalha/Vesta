import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Modal from "@mui/material/Modal";
import { Plus } from "./icons";
import StatusList from "./issueStatusMenu";
import { statusList } from "../helpers/global";
import { Alert } from "@mui/material";
const AddIssueModal = ({ updateIssues, columnStatus }) => {
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(
    statusList.indexOf(columnStatus)
  );
  const [titleRequired, setTitleRequired] = useState(false);
  const initialIndex = statusList.indexOf(columnStatus);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedIndex(initialIndex);
  };
  const notEmptyString = /^(?!\s*$).+/;
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
      const newStateId = newState.idSymbol + "-" + newState.idCounter;
      const newIssue = {
        title: title,
        description: description,
        parent: parentid,
      };
      newState.issues[newStateId] = newIssue;
      newState.columns[statusList[selectedIndex]].issues.push(newStateId);
      newState.idCounter += 1;
      return newState;
    });
    setDescription("");
    setTitle("");
    handleClose();
  };

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
  return (
    <>
      <button onClick={handleOpen} className="add-card-issue-button">
        <Plus />
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="add-issue-modal">
          <div className="add-issue-modal-content">
            <div className="add-issue-modal-content-header">
              <div className="add-issue-modal-content-header-buttons">
                <button
                  className="exit-add-issue-modal-button"
                  onClick={handleClose}
                >
                  <Plus sx={{ transform: "rotate(45deg)" }} />
                </button>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <input
                className="new-issue-input-placeholder"
                placeholder="Issue title"
                autoFocus
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
            </div>
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
            <div className="flex-container">
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
      </Modal>
    </>
  );
};

export default AddIssueModal;
