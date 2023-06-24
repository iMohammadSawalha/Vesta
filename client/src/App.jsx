import Landing from "./views/landing";
import Login from "./views/login";
import Register from "./views/register";
import WorkSpace from "./views/workspace";
import RequireAuth from "./components/requireAuth";
import PersistLogin from "./components/persistLogin";
import { Routes, Route } from "react-router-dom";
import Test from "./views/test";
function App() {
  return (
    <Routes>
      <Route path="/" index element={<Landing />} />
      <Route path="/test" index element={<Test />} />
      <Route path="/login" index element={<Login />} />
      <Route path="/register" index element={<Register />} />
      <Route element={<PersistLogin />}>
        <Route element={<RequireAuth />}>
          <Route path="/:url/*" index element={<WorkSpace />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
