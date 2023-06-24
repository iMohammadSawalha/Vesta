import { Droppable } from "react-beautiful-dnd";
import IssueCard from "../components/issue";
import AddIssueModal from "./addIssuesModal";
import { statusList, columnTitles } from "../helpers/global";
import useAuth from "../hooks/useAuth";
const IssueColumn = () => {
  const HOVERBACKGROUNDCOLOR = "rgba(55, 56, 95,0.3)";
  const { issues } = useAuth();
  return issues?.columns_order.map((columnName) => (
    <div className="status-col" key={columnName}>
      <div className="status-col-title">
        {columnTitles[statusList.indexOf(columnName)]}
        <div className="status-col-issues-counter">
          {(() => {
            const column = issues.columns.find(
              (column) => column.id === columnName
            );
            return column.issues.length;
          })()}
        </div>
        <div className="issues-column-buttons">
          <AddIssueModal columnStatus={columnName} />
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
            {(() => {
              const column = issues.columns.find(
                (column) => column.id === columnName
              );
              return column.issues.map((item, index) => (
                <IssueCard
                  id={item}
                  issue={issues.issues.find((issue) => issue.id === item)}
                  key={item}
                  index={index}
                />
              ));
            })()}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  ));
};
export default IssueColumn;
