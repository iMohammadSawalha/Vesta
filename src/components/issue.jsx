import { Draggable } from "react-beautiful-dnd";
import { RightCheveron } from "./icons";

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
          <div className="issue-card-content">
            <div className="issue-card-header">
              <span>{props.id}</span>
              {props.parent && (
                <>
                  <RightCheveron />
                  <span>{props.parent}</span>
                </>
              )}
            </div>
            <div className="issue-card-title">{props.title}</div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default IssueCard;
