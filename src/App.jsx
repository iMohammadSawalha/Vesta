import Login from "./views/login";
import Register from "./views/register";
import WorkSpace from "./views/workspace";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" index element={<WorkSpace />} />
        <Route path="/login" index element={<Login />} />
        <Route path="/register" index element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
