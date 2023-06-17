import { flushSync } from "react-dom";
import { DragDropContext } from "react-beautiful-dnd";
import IssueColumn from "./columns";
const Kanban = ({ issues, updateIssues }) => {
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
      tempIssues.issues[issueId].status = dColumn;
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
          <IssueColumn issues={issues} updateIssues={updateIssues} />
        </div>
      </div>
    </DragDropContext>
  );
};

export default Kanban;
