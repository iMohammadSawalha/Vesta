import Landing from "./views/landing";
import Login from "./views/login";
import NotFound from "./views/notFound";
import Register from "./views/register";
import WorkSpace from "./views/workspace";
import RequireAuth from "./components/requireAuth";
import PersistLogin from "./components/persistLogin";
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <Routes>
      <Route path="/" index element={<Landing />} />
      <Route element={<PersistLogin />}>
        <Route element={<RequireAuth />}>
          <Route path="/issues/*" index element={<WorkSpace />} />
        </Route>
      </Route>
      <Route path="/login" index element={<Login />} />
      <Route path="/register" index element={<Register />} />
      <Route path="*" index element={<NotFound />} />
    </Routes>
  );
}

export default App;
