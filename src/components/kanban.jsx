import IssueCard from "../components/issue";
const Kanban = (props) => {
  return (
    <>
      <div className="status-row">
        <div className="status-col status-backlog bg-success">
          <div className="status-col-title">
            <span>Backlog</span>
          </div>
          <IssueCard />
          <IssueCard />
          <IssueCard />
        </div>
        <div className="status-col status-todo">
          <div className="status-col-title">
            <span>Todo</span>
          </div>
          <IssueCard />
          <IssueCard />
          <IssueCard />
        </div>
        <div className="status-col status-in-progress bg-success">
          <div className="status-col-title">
            <span>In Progress</span>
          </div>
          <IssueCard />
          <IssueCard />
          <IssueCard />
        </div>
        <div className="status-col status-done">
          <div className="status-col-title">
            <span>Done</span>
          </div>
          <IssueCard />
          <IssueCard />
          <IssueCard />
        </div>
      </div>
    </>
  );
};

export default Kanban;
