import { CircularProgress, LinearProgress } from "@mui/material";
import "../views/landing.css";
const Loading = () => {
  return (
    <div className="loading-page-background">
      <div
        style={{
          height: "100%",
          display: "flex",
          gap: "1rem",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#645bff",
        }}
      >
        <CircularProgress color="inherit" />
        <h2
          style={{
            color: "#a9a4fc",
            fontWeight: "500",
          }}
        >
          Loading
        </h2>
      </div>
    </div>
  );
};
export default Loading;
