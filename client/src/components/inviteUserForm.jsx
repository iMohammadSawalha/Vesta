import { Menu, Snackbar } from "@mui/material";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState } from "react";
import { useParams } from "react-router-dom";
const InviteUserForm = ({
  menuButton,
  setAnchorEl,
  anchorEl,
  openInviteUserFormHandle,
}) => {
  const { url } = useParams();
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState();
  const [message, setMessage] = useState("");
  const axiosPrivate = useAxiosPrivate();
  let InviteUserFormOpen = Boolean(anchorEl);
  const closeInviteUserFormHandle = () => {
    setEmail("");
    setAnchorEl(null);
  };
  const addUserToWorkspace = async () => {
    try {
      const response = await axiosPrivate.post(
        "/api/workspace/invite",
        {
          email,
          url,
        },
        {
          "Content-Type": "application/json",
          withCredentials: true,
        }
      );
      setMessage("User added to workspace!");
      setOpen(true);
      closeInviteUserFormHandle();
    } catch (error) {
      if (error.response.status === 400) {
        setMessage("Please enter a valid email.");
        setOpen(true);
      }
      if (error.response.status === 404) {
        setMessage("User with that email does not exist.");
        setOpen(true);
      }
    }
  };

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => {
          setMessage("");
          setOpen(false);
        }}
        message={message}
      />
      {!menuButton && (
        <button
          onClick={openInviteUserFormHandle}
          className="pruple-button"
          style={{ color: "white" }}
        >
          Invite
        </button>
      )}
      {menuButton}
      <Menu
        className="invite-form"
        anchorEl={anchorEl}
        open={InviteUserFormOpen}
        onClose={closeInviteUserFormHandle}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            style: {
              maxHeight: "30rem",
              padding: "0.5rem",
              backgroundColor: "rgb(39, 40, 53)",
              boxShadow: "box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px",
            },
          },
        }}
      >
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="invite-forum-input"
          placeholder="Enter email ..."
        />
        <button
          onClick={addUserToWorkspace}
          className="pruple-button add-to-workspace-button"
          style={{ color: "white" }}
        >
          Add to workspace
        </button>
      </Menu>
    </>
  );
};
export default InviteUserForm;
