import { Draggable } from "react-beautiful-dnd";
import { RightCheveron } from "./icons";
import { Link } from "react-router-dom";
function IssueCard(props) {
  return (
    <Draggable draggableId={props.id} index={props.index} key={props.id}>
      {(provided) => (
        <div
          className="issue-card"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Link
            to={"/issue/" + props.id}
            style={{ textDecoration: "none", cursor: "default" }}
          >
            <div className="issue-card-content">
              <div className="issue-card-header">
                <span>{props.id}</span>
                {props.parent && (
                  <>
                    <RightCheveron sx={{ fontSize: 16 }} />
                    <span>{props.parent}</span>
                  </>
                )}
              </div>
              <div className="issue-card-title">{props.title}</div>
            </div>
          </Link>
        </div>
      )}
    </Draggable>
  );
}

export default IssueCard;
