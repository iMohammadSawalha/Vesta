import { Modal } from "@mui/material";
import { useState } from "react";
import { TrashCan } from "./icons";
import { useNavigate } from "react-router-dom";
const DeleteIssueModal = ({ id, issues, updateIssues }) => {
  const nvagiate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleDelete = () => {
    if (!(id in issues.issues)) return;
    updateIssues((prevState) => {
      const newIssues = JSON.parse(JSON.stringify(prevState));
      const issueStatus = newIssues.issues[id].status;
      delete newIssues.issues[id];
      newIssues.columns[issueStatus].issues.splice(
        newIssues.columns[issueStatus].issues.indexOf(id),
        1
      );
      return newIssues;
    });
    nvagiate(-1);
  };
  return (
    <>
      <button className="delete-issue-modal-button" onClick={handleOpenModal}>
        <TrashCan />
        Delete
      </button>
      <Modal open={openModal} onClose={handleCloseModal}>
        <div className="delete-issue-modal">
          <div className="delete-issue-modal-content">
            <div className="delete-issue-modal-content-header">
              Are you sure you want to delete issue "{id}" ?
            </div>
            <div className="delete-issue-modal-content-buttons">
              <div className="cancel-delete-issue-button">
                <button
                  className="new-issue-save-button"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
              </div>
              <div className="delete-issue-button">
                <button
                  className="new-issue-save-button"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DeleteIssueModal;
