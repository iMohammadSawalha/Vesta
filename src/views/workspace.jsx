import { Route, Routes } from "react-router-dom";
import Kanban from "../components/kanban";
import IssueBigScreen from "../components/issueBigScreen";
import { useState } from "react";
import data from "../assets/testdata/issues";
import "./workspace.css";
import Sidebar from "../components/sidebar";
import "../App.css";
import Navbar from "../components/navbar";
const WorkSpace = () => {
  const [issues, updateIssues] = useState(data);
  const [sidebarActive, setSidebarActive] = useState(false);
  const toggleSidebar = () => {
    sidebarActive ? setSidebarActive(false) : setSidebarActive(true);
  };
  return (
    <div className="workspace-container">
      <Sidebar
        updateIssues={updateIssues}
        issues={issues}
        active={sidebarActive}
      />
      <div className="workspace-content">
        <Navbar sidebarToggler={toggleSidebar} sidebarActive={sidebarActive} />
        <Routes>
          <Route
            path="/all"
            index
            element={<Kanban issues={issues} updateIssues={updateIssues} />}
          />
          <Route
            path="/:id"
            index
            element={
              <IssueBigScreen issues={issues} updateIssues={updateIssues} />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default WorkSpace;
