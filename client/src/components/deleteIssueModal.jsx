import { Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { TrashCan } from "./icons";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
const DeleteIssueModal = () => {
  const { id, url } = useParams();
  const navigate = useNavigate();
  const { issues, socket, setIssues } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const errorHandler = (error) => {
    console.log(error.message);
  };
  const deleteIssueRequest = () => {
    try {
      navigate(-1);
      socket.emit(
        "delete_issue",
        {
          url: url,
          id: id,
        },
        errorHandler
      );
    } catch (error) {
      //TODO ERROR MESSAGE HANDLE
      console.log(error);
    }
  };
  const handleDelete = async () => {
    const issue = issues.issues.find((issue) => issue.id === id);
    if (!issue) return;
    deleteIssueRequest();
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
