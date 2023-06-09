import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import IssueCard from "../components/issue";
import { useState } from "react";
const IssueColumn = ({ data }) => {
  const [issues, updateIssues] = useState(data);
  const handleOnDragEnd = (result) => {
    const sColumn = result.source.droppableId;
    const sIndex = result.source.index;
    const DColumn = result.destination.droppableId;
    const DIndex = result.destination.index;
    const newIssues = JSON.parse(JSON.stringify(issues));
    const issueHolder = newIssues[sColumn].splice(sIndex, 1);
    newIssues[DColumn].splice(DIndex, 0, issueHolder[0]);
    updateIssues(JSON.parse(JSON.stringify(newIssues)));
  };
  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      {Object.keys(issues).map((key) => (
        <div className="status-col bg-success" key={key}>
          <div className="status-col-title">
            <span>{key}</span>
          </div>
          <Droppable droppableId={key}>
            {(provided) => (
              <div ref={provided.innerRef}>
                {issues[key].map((item, index) => (
                  <Draggable draggableId={item.id} index={index} key={item.id}>
                    {(provided) => (
                      <IssueCard
                        draggableProps={provided.draggableProps}
                        dragHandleProps={provided.dragHandleProps}
                        {...item}
                        innerRef={provided.innerRef}
                        key={item.id}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      ))}
    </DragDropContext>
  );
};
export default IssueColumn;
