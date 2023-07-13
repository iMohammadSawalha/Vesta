import { flushSync } from "react-dom";
import { DragDropContext } from "react-beautiful-dnd";
import IssueColumn from "./columns";
import useAuth from "../hooks/useAuth";
import { useParams } from "react-router-dom";
const Kanban = () => {
  const { setIssues, socket } = useAuth();
  const { url } = useParams();
  const moveIssueClient = (issueId, sColumn, sIndex, dColumn, dIndex) => {
    flushSync(() => {
      setIssues((prev) => {
        const tempIssues = JSON.parse(JSON.stringify(prev));
        const fromColumn = tempIssues.columns.find(
          (column) => column.id === sColumn
        );
        if (fromColumn.issues.indexOf(issueId) !== sIndex) return prev;
        fromColumn.issues.splice(sIndex, 1);
        if (dColumn !== sColumn) {
          const toColumn = tempIssues.columns.find(
            (column) => column.id === dColumn
          );
          toColumn.issues.splice(dIndex, 0, issueId);
          const issueToUpdate = tempIssues.issues.find(
            (issue) => issue.id === issueId
          );
          issueToUpdate.status = dColumn;
        } else {
          fromColumn.issues.splice(dIndex, 0, issueId);
        }
        return tempIssues;
      });
    });
  };
  const errorHandler = (error) => {
    console.log(error.message);
  };
  const moveIssueRequest = async (
    issueId,
    sColumn,
    sIndex,
    dColumn,
    dIndex
  ) => {
    try {
      socket.emit(
        "move_issue",
        {
          url: url,
          id: issueId,
          sColumn: sColumn,
          sIndex: sIndex,
          dColumn: dColumn,
          dIndex: dIndex,
        },
        errorHandler
      );
    } catch (error) {
      console.log(error);
      //TODO ERROR MESSAGE HANDLE
    }
  };
  const handleOnDragEnd = async (result) => {
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
    moveIssueClient(issueId, sColumn, sIndex, dColumn, dIndex);
    moveIssueRequest(issueId, sColumn, sIndex, dColumn, dIndex);
  };
  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className="issues-container-main">
        <div className="issues-row-container">
          <div className="status-row">
            <IssueColumn />
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Kanban;
