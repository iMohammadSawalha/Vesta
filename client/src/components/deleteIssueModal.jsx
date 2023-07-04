import { Modal } from "@mui/material";
import { useState } from "react";
import { TrashCan } from "./icons";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
const DeleteIssueModal = () => {
  const { id, url } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { issues, setIssues } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const deleteIssueRequest = async () => {
    try {
      const response = await axiosPrivate.post(
        "/api/issue/delete",
        {
          url: url,
          id: id,
        },
        {
          "Content-Type": "application/json",
          withCredentials: true,
        }
      );
      const newIssues = JSON.parse(JSON.stringify(issues));
      const issueToUpdate = newIssues.issues.find((issue) => issue.id === id);
      const issueStatus = issueToUpdate.status;
      const indexOfIssue = newIssues.issues.findIndex(
        (issue) => issue.id === id
      );
      newIssues.issues.splice(indexOfIssue, 1);
      const columnToUpdate = newIssues.columns.find(
        (column) => column.id === issueStatus
      );
      columnToUpdate.issues.splice(columnToUpdate.issues.indexOf(id), 1);
      setIssues(newIssues);
      navigate(-1);
    } catch (error) {
      //TODO ERROR MESSAGE HANDLE
      console.log(error);
    }
  };
  const handleDelete = async () => {
    const issue = issues.issues.find((issue) => issue.id === id);
    if (!issue) return;
    await deleteIssueRequest();
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
