import { Menu, MenuItem } from "@mui/material";
import SidebarButton from "./sidebarButton";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import DeleteWorkspaceModal from "./deleteWorkspaceModal";
import AvatarGen from "./avatarGen";

const WorkspacesMenu = () => {
  const { auth, setAuth } = useAuth();
  const workspaces = auth.workspaces;
  const defaultWorkspace = auth.defaultWorkspace;
  const [anchorEl, setAnchorEl] = useState(null);
  const WrokspaceMenuOpen = Boolean(anchorEl);
  const closeWorkspaceMenuHandle = () => {
    setAnchorEl(null);
  };
  const openWorkspaceMenuHandle = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const setDefaultWorkspace = (workspace) => {
    setAuth((prev) => {
      return {
        ...prev,
        defaultWorkspace: {
          url_id: workspace.url_id,
          name: workspace.name,
          image: workspace.image,
        },
      };
    });
  };
  return (
    <>
      <SidebarButton
        style={{
          marginBottom: "3rem",
          width: "80%",
        }}
        content={defaultWorkspace.name}
        icon={
          <img
            style={{ marginRight: "0.2rem" }}
            width="25px"
            height="25px"
            src={defaultWorkspace.image}
          />
        }
        action={openWorkspaceMenuHandle}
      />
      <Menu
        className="workspaces-menu-container"
        anchorEl={anchorEl}
        open={WrokspaceMenuOpen}
        onClose={closeWorkspaceMenuHandle}
        slotProps={{
          paper: {
            style: {
              maxHeight: "30rem",
              width: "16rem",
              backgroundColor: "rgb(39, 40, 53)",
            },
          },
        }}
      >
        {workspaces.map((workspace) => (
          <div style={{ display: "flex" }} key={workspace.url_id + "div"}>
            <Link
              className="workspace-menu-item"
              to={"/"}
              key={workspace.url_id}
              onClick={() => setDefaultWorkspace(workspace)}
            >
              <MenuItem
                key={workspace.url_id}
                className="workspace-menu-item-inner"
              >
                <span
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center",
                    gap: 5,
                  }}
                >
                  <img width="25px" height="25px" src={workspace.image} />
                  <span>{workspace.name}</span>
                </span>
              </MenuItem>
            </Link>
            <DeleteWorkspaceModal workspace={workspace} />
          </div>
        ))}
        <div
          style={{
            position: "sticky",
            bottom: "0rem",
            zIndex: 10,
            backgroundColor: "rgb(39, 40, 53)",
            height: "60px",
          }}
        >
          <div className="horizontal-line-div"></div>
          <Link
            className="workspace-menu-item"
            to="/workspace/new"
            key="new-workspace"
          >
            <MenuItem
              key="new-workspace"
              className="workspace-menu-item-inner workspace-menu-item-inner-no-wrap"
            >
              <span>Create new workspace</span>
            </MenuItem>
          </Link>
        </div>
      </Menu>
    </>
  );
};
export default WorkspacesMenu;
