import { Link } from "react-router-dom";
import { AlertCircle, Plus } from "./icons";
const IssueNotFound = ({ id }) => {
  return (
    <div className="big-screen-issue">
      <div className="big-screen-issue-content">
        <div className="big-screen-issue-header">
          <div className="exit-big-screen-issue">
            <Link to="/">
              <button className="exit-add-issue-modal-button">
                <Plus sx={{ transform: "rotate(45deg)" }} />
              </button>
            </Link>
          </div>
        </div>
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "grey",
            whiteSpace: "break-spaces",
          }}
        >
          <div
            style={{
              marginBottom: "1rem",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AlertCircle sx={{ marginRight: "0.5rem" }} />
            Issue not found
          </div>
          <div>
            There is not Issue with ID
            <span style={{ color: "white" }}> '{id}' </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default IssueNotFound;
