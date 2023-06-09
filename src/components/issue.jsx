import { RightCheveron } from "./icons";

function IssueCard(props) {
  return (
    <div
      className="issue-card"
      ref={props.innerRef}
      {...props.draggableProps}
      {...props.dragHandleProps}
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
  );
}

export default IssueCard;
