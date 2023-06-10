import data from "../assets/testdata/issues.js";
import IssueColumn from "./columns";
const Kanban = () => {
  return (
    <>
      <IssueColumn data={data} />
    </>
  );
};

export default Kanban;
