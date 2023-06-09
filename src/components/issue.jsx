import { RightCheveron } from "./icons";

function IssueCard() {
  return (
    <div className="issue-card" draggable>
      <div className="issue-card-content">
        <div>
          <span>ID#</span>
          <RightCheveron />
          <span>parent issue</span>
        </div>
        <div>Issue Title</div>
      </div>
    </div>
  );
}

export default IssueCard;
