import data from "../assets/testdata/issues.json";
import IssueColumn from "./columns";
const Kanban = () => {
  return (
    <>
      <div className="status-row">
        <IssueColumn data={data} />
      </div>
    </>
  );
};

export default Kanban;
