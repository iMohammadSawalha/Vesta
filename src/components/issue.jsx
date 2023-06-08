import Card from "react-bootstrap/Card";
import { RightCheveron } from "./icons";
import { useState } from "react";

function IssueCard() {
  return (
    <Card className="issue-card" draggable>
      <Card.Body>
        <div>
          <span>ID#</span>
          <RightCheveron />
          <span>parent issue</span>
        </div>
        <div>Issue Title</div>
      </Card.Body>
    </Card>
  );
}

export default IssueCard;
