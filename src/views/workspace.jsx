import { BrowserRouter, Route, Routes } from "react-router-dom";
import Kanban from "../components/kanban";
import IssueBigScreen from "../components/issueBigScreen";
import { useState } from "react";
import data from "../assets/testdata/issues";
const WorkSpace = () => {
  const [issues, updateIssues] = useState(data);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path=""
          index
          element={<Kanban issues={issues} updateIssues={updateIssues} />}
        />
        <Route
          path="/issue/:id"
          index
          element={
            <IssueBigScreen issues={issues} updateIssues={updateIssues} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default WorkSpace;
