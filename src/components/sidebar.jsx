import { useState } from "react";
import AddIssueModal from "./addIssuesModal";
import { SquareEdit, SquareRound } from "./icons";
import "./sidebar.css";
import SidebarButton from "./sidebarButton";
const Sidebar = ({ updateIssues, issues, active }) => {
  const [newIssueTrigger, setNewIssueTrigger] = useState(false);
  const ModalTrigger = () => {
    setNewIssueTrigger(1);
  };
  const IS = { fontSize: "20px" };
  return (
    <div className={active ? "sidebar-container active" : "sidebar-container"}>
      <div className="sidebar-content">
        <AddIssueModal
          updateIssues={updateIssues}
          columnStatus="backlog"
          idSymbol={issues.idSymbol}
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
          to="/issues"
          icon={<SquareRound sx={IS} />}
        />
        <SidebarButton content="My issues" icon={<SquareRound sx={IS} />} />
      </div>
    </div>
  );
};
export default Sidebar;
