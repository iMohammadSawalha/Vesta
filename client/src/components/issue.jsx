import { Draggable } from "react-beautiful-dnd";
import { RightCheveron } from "./icons";
import { Link } from "react-router-dom";
import IssueAssigneeMenu from "./issueAssignee";
import { useState } from "react";
function IssueCard({ id, issue, index }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const openWorkspaceMenuHandle = (event) => {
    setAnchorEl(event.currentTarget);
  };
  return (
    <Draggable draggableId={id} index={index} key={id}>
      {(provided) => (
        <div
          className="issue-card"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="issue-card-header-assingee">
            <IssueAssigneeMenu
              id={id}
              anchorEl={anchorEl}
              setAnchorEl={setAnchorEl}
              openWorkspaceMenuHandle={openWorkspaceMenuHandle}
            />
          </div>
          <Link to={id} style={{ textDecoration: "none", cursor: "default" }}>
            <div className="issue-card-content">
              <div className="issue-card-header">
                <div className="issue-card-header-id">
                  <span>{id}</span>
                  {issue?.parent && (
                    <>
                      <RightCheveron sx={{ fontSize: 16 }} />
                      <span>{issue?.parent}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="issue-card-title">{issue?.title}</div>
            </div>
          </Link>
        </div>
      )}
    </Draggable>
  );
}

export default IssueCard;
