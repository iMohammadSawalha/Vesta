import { Modal } from "@mui/material";
import { useState } from "react";
import { TrashCan } from "./icons";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useDeleteWorkspace from "../hooks/useDeleteWorkspace";
const DeleteWorkspaceModal = ({ workspace }) => {
  const url = workspace.url_id;
  const deleteWorkspace = useDeleteWorkspace();
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const deleteWorkspaceHandle = async () => {
    const deleteStatus = await deleteWorkspace(url);
    if (deleteStatus !== 204) return;
    setAuth((prev) => {
      const indexOfWorkspace = prev.workspaces.findIndex(
        (ws) => ws.url_id === url
      );
      prev.workspaces.splice(indexOfWorkspace, 1);
      if (prev.defaultWorkspace.url_id === url)
        if (prev?.workspaces[0]?.url_id) {
          prev.defaultWorkspace.url_id = prev.workspaces[0].url_id;
          prev.defaultWorkspace.name = prev.workspaces[0].name;
          prev.defaultWorkspace.image = prev.workspaces[0].image;
        } else {
          prev.defaultWorkspace = null;
        }
      return prev;
    });
    navigate("/");
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
              Are you sure you want to delete the workspace "
              <span style={{ color: "#8260fc" }}>{workspace.name}</span>" with
              URL : "
              <span style={{ color: "#6068fc" }}>
                Vesta.com/{workspace.url}
              </span>
              " ?
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
                  onClick={deleteWorkspaceHandle}
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

export default DeleteWorkspaceModal;
