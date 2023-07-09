import Landing from "./views/landing";
import Login from "./views/login";
import Register from "./views/register";
import WorkSpace from "./views/workspace";
import RequireAuth from "./components/requireAuth";
import PersistLogin from "./components/persistLogin";
import { Routes, Route } from "react-router-dom";
import DefaultWorkspace from "./components/defaultWorkspace";
import CreateWorkspace from "./views/createWorkspace";
import Kanban from "./components/kanban";
import IssueBigScreen from "./components/issueBigScreen";
import Profile from "./views/profile";
function App() {
  return (
    <Routes>
      <Route element={<PersistLogin />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<RequireAuth />}>
          <Route path="/workspace/new" element={<CreateWorkspace />} />
          <Route
            path="/workspace/default"
            index
            element={<DefaultWorkspace />}
          />
          <Route path="/:url" element={<WorkSpace />}>
            <Route index element={<Kanban />} />
            <Route path="/:url/profile" element={<Profile />} />
            <Route path="/:url/:id" element={<IssueBigScreen />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
