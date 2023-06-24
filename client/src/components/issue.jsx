import { Draggable } from "react-beautiful-dnd";
import { RightCheveron } from "./icons";
import { Link } from "react-router-dom";
function IssueCard({ id, issue, index }) {
  return (
    <Draggable draggableId={id} index={index} key={id}>
      {(provided) => (
        <div
          className="issue-card"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Link
            to={"/issues/" + id}
            style={{ textDecoration: "none", cursor: "default" }}
          >
            <div className="issue-card-content">
              <div className="issue-card-header">
                <span>{id}</span>
                {issue?.parent && (
                  <>
                    <RightCheveron sx={{ fontSize: 16 }} />
                    <span>{issue?.parent}</span>
                  </>
                )}
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
