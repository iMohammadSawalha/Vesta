import Landing from "./views/landing";
import Login from "./views/login";
import NotFound from "./views/notFound";
import Register from "./views/register";
import WorkSpace from "./views/workspace";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" index element={<Landing />} />
        <Route path="/issues/*" index element={<WorkSpace />} />
        <Route path="/login" index element={<Login />} />
        <Route path="/register" index element={<Register />} />
        <Route path="*" index element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
