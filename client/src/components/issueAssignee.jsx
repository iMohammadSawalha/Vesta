import { Menu, MenuItem } from "@mui/material";
import useAuth from "../hooks/useAuth";
import userImage from "../assets/images/user.png";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useParams } from "react-router-dom";
const IssueAssigneeMenu = ({
  id,
  width,
  height,
  menuButton,
  setAnchorEl,
  anchorEl,
  openWorkspaceMenuHandle,
}) => {
  if (!width) width = 25;
  if (!height) height = 25;
  const { url } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const { issues, setIssues } = useAuth();
  let WrokspaceMenuOpen = Boolean(anchorEl);
  const closeWorkspaceMenuHandle = () => {
    setAnchorEl(null);
  };
  const issueObj = issues.issues.find((issue) => issue.id === id);
  const saveIssueRequest = async (assignee) => {
    let assigneeID = assignee?._id;
    if (!assignee?._id) assigneeID = null;
    try {
      const response = await axiosPrivate.post(
        "/api/issue/edit",
        {
          url: url,
          issue: {
            id: id,
            assignee: assigneeID,
          },
        },
        {
          "Content-Type": "application/json",
          withCredentials: true,
        }
      );
      const newState = JSON.parse(JSON.stringify(issues));
      const issueToUpdate = newState.issues.find((issue) => issue.id === id);
      if (assigneeID) {
        issueToUpdate.assignee = {
          _id: assignee._id,
          email: assignee.email,
          image: assignee.image,
        };
      } else {
        issueToUpdate.assignee = null;
      }
      setIssues(newState);
      closeWorkspaceMenuHandle();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {!menuButton && (
        <button
          onClick={openWorkspaceMenuHandle}
          className="open-assignees-menu-button"
        >
          <img
            width={width}
            height={height}
            src={issueObj?.assignee?.image || userImage}
          />
        </button>
      )}
      {menuButton}
      <Menu
        className="assignees-menu"
        anchorEl={anchorEl}
        open={WrokspaceMenuOpen}
        onClose={closeWorkspaceMenuHandle}
        slotProps={{
          paper: {
            style: {
              maxHeight: "30rem",
              width: "fit-content",
              padding: "0.5rem",
              backgroundColor: "rgb(39, 40, 53)",
              boxShadow: "box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;",
            },
          },
        }}
      >
        <MenuItem
          className="assignees-menu-item"
          onClick={() => saveIssueRequest(null)}
        >
          <img width={22} height={22} src={userImage} />
          <span style={{ marginLeft: "0.5rem" }}>No assignee</span>
        </MenuItem>
        {issues.members.map((member) => (
          <MenuItem
            className="assignees-menu-item"
            onClick={() => saveIssueRequest(member.user)}
          >
            <img width={22} height={22} src={member.user.image} />
            <span style={{ marginLeft: "0.5rem" }}>{member.user.email}</span>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
export default IssueAssigneeMenu;
