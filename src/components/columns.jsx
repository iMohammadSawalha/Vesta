import { Droppable } from "react-beautiful-dnd";
import IssueCard from "../components/issue";
import AddIssueModal from "./addIssuesModal";
import { statusList, columnTitles } from "../helpers/global";
const IssueColumn = ({ issues, updateIssues }) => {
  const HOVERBACKGROUNDCOLOR = "rgba(44, 44, 85, 0.397)";
  return issues.columnsOrder.map((columnName) => (
    <div className="status-col" key={columnName}>
      <div className="status-col-title">
        {columnTitles[statusList.indexOf(columnName)]}
        <div className="status-col-issues-counter">
          {issues.columns[columnName].issues.length}
        </div>
        <div className="issues-column-buttons">
          <AddIssueModal
            columnStatus={columnName}
            updateIssues={updateIssues}
          />
        </div>
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
  ));
};
export default IssueColumn;
