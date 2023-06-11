import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import IssueCard from "../components/issue";
import { useState } from "react";
import { flushSync } from "react-dom";
const IssueColumn = ({ data }) => {
  const HOVERBACKGROUNDCOLOR = "rgba(44, 44, 85, 0.397)";
  const [issues, updateIssues] = useState(data);
  const handleOnDragEnd = (result) => {
    if (result.reason == "CANCEL") return;
    if (!result.destination) return;
    if (
      result.destination.index === result.source.index &&
      result.destination.droppableId === result.source.droppableId
    )
      return;
    const issueId = result.draggableId;
    const sColumn = result.source.droppableId;
    const sIndex = result.source.index;
    const dColumn = result.destination.droppableId;
    const dIndex = result.destination.index;
    const tempIssues = JSON.parse(JSON.stringify(issues));
    const fromColumn = Array.from(issues.columns[sColumn].issues);
    fromColumn.splice(sIndex, 1);
    if (result.destination.droppableId !== result.source.droppableId) {
      const toColumn = Array.from(issues.columns[dColumn].issues);
      toColumn.splice(dIndex, 0, issueId);
      tempIssues.columns[sColumn].issues = fromColumn;
      tempIssues.columns[dColumn].issues = toColumn;
    } else {
      fromColumn.splice(dIndex, 0, issueId);
      tempIssues.columns[sColumn].issues = fromColumn;
    }
    flushSync(() => {
      updateIssues(tempIssues);
    });
  };
  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className="issues-row-container">
        <div className="status-row">
          {issues.columnsOrder.map((columnName) => (
            <div className="status-col" key={columnName}>
              <div className="status-col-title">
                <span>{issues.columns[columnName].title}</span>
              </div>
              <Droppable droppableId={columnName}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    className="column-placeholder"
                    style={{
                      backgroundColor: snapshot.isDraggingOver
                        ? HOVERBACKGROUNDCOLOR
                        : "initial",
                    }}
                  >
                    {issues.columns[columnName].issues.map((item, index) => (
                      <IssueCard
                        id={item}
                        {...issues.issues[item]}
                        key={item}
                        index={index}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
};
export default IssueColumn;
