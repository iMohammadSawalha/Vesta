import { useState } from "react";
import AddIssueModal from "./addIssuesModal";
import { SquareEdit, SquareRound } from "./icons";
import "./sidebar.css";
import SidebarButton from "./sidebarButton";
import useAuth from "../hooks/useAuth";
import WorkspacesMenu from "./workspacesMenu";
const Sidebar = ({ active, signOut }) => {
  const { auth } = useAuth();
  const [newIssueTrigger, setNewIssueTrigger] = useState(false);
  const ModalTrigger = () => {
    setNewIssueTrigger(1);
  };
  const IS = { fontSize: "20px" };
  return (
    <div className={active ? "sidebar-container active" : "sidebar-container"}>
      <div className="sidebar-content">
        <WorkspacesMenu />
        <AddIssueModal
          columnStatus="backlog"
          noButton
          openModalTrigger={newIssueTrigger}
          setModalTrigger={setNewIssueTrigger}
        />
        <SidebarButton
          action={ModalTrigger}
          content="New issue"
          icon={<SquareEdit sx={IS} />}
        />
        <hr style={{ width: "100%" }} />
        <SidebarButton
          content="Issues"
          to={"/" + auth.defaultWorkspace.url_id}
          icon={<SquareRound sx={IS} />}
        />
        <SidebarButton
          content="My issues"
          icon={<SquareRound sx={IS} />}
          style={{ marginBottom: "auto" }}
        />
        <button
          class="logout-button-a logout-button-a-sidebar-custom"
          onClick={signOut}
          style={{ marginBottom: "2rem" }}
        >
          <div class="logout-button-a-icon">
            <svg viewBox="0 0 512 512">
              <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
            </svg>
          </div>

          <div class="logout-button-a-text">Logout</div>
        </button>
      </div>
    </div>
  );
};
export default Sidebar;
