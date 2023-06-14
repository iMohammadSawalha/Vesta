import { Route, Routes } from "react-router-dom";
import Kanban from "../components/kanban";
import IssueBigScreen from "../components/issueBigScreen";
import { useState } from "react";
import data from "../assets/testdata/issues";
import "./workspace.css";
const WorkSpace = () => {
  const [issues, updateIssues] = useState(data);
  return (
    <Routes>
      <Route
        path=""
        index
        element={<Kanban issues={issues} updateIssues={updateIssues} />}
      />
      <Route
        path="/issue/:id"
        index
        element={<IssueBigScreen issues={issues} updateIssues={updateIssues} />}
      />
    </Routes>
  );
};

export default WorkSpace;
