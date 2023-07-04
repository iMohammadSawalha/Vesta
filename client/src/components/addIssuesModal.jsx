import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Modal from "@mui/material/Modal";
import { Plus } from "./icons";
import StatusList from "./issueStatusMenu";
import { statusList } from "../helpers/global";
import { Alert, Avatar, Chip } from "@mui/material";
import { modulesQuill, formatsQuill } from "../helpers/global";
import { notEmptyString } from "../helpers/global";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useParams } from "react-router-dom";
const AddIssueModal = ({
  columnStatus,
  noButton,
  openModalTrigger,
  setModalTrigger,
}) => {
  const { url } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const { issues, setIssues } = useAuth();
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
    if (setModalTrigger) setModalTrigger(false);
    setOpen(false);
    setSelectedIndex(initialIndex);
  };
  const addIssueRequest = async () => {
    try {
      const newState = JSON.parse(JSON.stringify(issues));
      const newStateId = newState.symbol + "-" + newState.id_counter;
      const response = await axiosPrivate.post(
        "/api/issue/add",
        {
          url: url,
          issue: {
            id: newStateId,
            status: statusList[selectedIndex],
            title: title,
            description: description,
            // parent: parentid,
          },
        },
        {
          "Content-Type": "application/json",
          withCredentials: true,
        }
      );
      const newIssue = {
        id: newStateId,
        status: statusList[selectedIndex],
        title: title,
        description: description,
        // parent: parentid,
      };
      newState.issues.push(newIssue);
      const columnToUpdate = newState.columns.find(
        (column) => column.id === statusList[selectedIndex]
      );
      columnToUpdate.issues.push(newStateId);
      newState.id_counter += 1;
      setIssues(newState);
      setDescription("");
      setTitle("");
      handleClose();
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
    await addIssueRequest();
  };
  useEffect(() => {
    if (openModalTrigger) {
      handleOpen();
    }
  }, [openModalTrigger]);
  return (
    <>
      {!noButton && (
        <button onClick={handleOpen} className="add-card-issue-button">
          <Plus />
        </button>
      )}
      <Modal open={open} onClose={handleClose}>
        <div className="add-issue-modal">
          <div className="add-issue-modal-content">
            <div className="add-issue-modal-content-header">
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
                      {issues?.symbol}
                    </div>
                  </Avatar>
                }
                label="New Issue"
                sx={{ color: "#dbdbdb" }}
              />
              <div className="add-issue-modal-content-header-buttons">
                <button
                  className="exit-add-issue-modal-button"
                  onClick={handleClose}
                >
                  <Plus sx={{ transform: "rotate(45deg)" }} />
                </button>
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
            <div className="new-issue-modal-footer">
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
                Create
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddIssueModal;
