import { useState } from "react";
import { Sidebar } from "./icons";
import InviteUserForm from "./inviteUserForm";

const Navbar = ({ sidebarToggler, sidebarActive }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const openInviteUserFormHandle = (event) => {
    setAnchorEl(event.currentTarget);
  };
  return (
    <div className="navbar-container">
      <div
        className={
          sidebarActive
            ? "sidebar-toggle-button-container active"
            : "sidebar-toggle-button-container"
        }
      >
        <button className="add-card-issue-button" onClick={sidebarToggler}>
          <Sidebar />
        </button>
      </div>
      <div style={{ marginLeft: "auto", marginRight: "5%" }}><InviteUserForm openInviteUserFormHandle={openInviteUserFormHandle} anchorEl={anchorEl} setAnchorEl={setAnchorEl} /></div>
    </div>
  );
};
export default Navbar;
