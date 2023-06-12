import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { StrictMode } from "react";

ReactDOM.createRoot(document.getElementById("root")).render(
  //   <StrictMode> Strict Mode Commented for React Beautiful DnD to work , they don't support it, Keep On for Testing Other Components
  <App />
  //   </StrictMode>
);
