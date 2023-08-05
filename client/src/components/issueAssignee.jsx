import {
  Badge,
  Menu,
  MenuItem,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import useAuth from "../hooks/useAuth";
import userImage from "../assets/images/user.png";
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
  const { issues, setIssues, socket, onlineUsers } = useAuth();
  let WrokspaceMenuOpen = Boolean(anchorEl);
  const closeWorkspaceMenuHandle = () => {
    setAnchorEl(null);
  };
  const issueObj = issues.issues.find((issue) => issue.id === id);
  const errorHandler = (error) => {
    console.log(error.message);
  };
  const saveIssueRequest = async (assignee) => {
    let assigneeID = assignee?._id;
    if (!assignee?._id) assigneeID = null;
    try {
      // const response = await axiosPrivate.post(
      //   "/api/issue/edit",
      //   {
      //     url: url,
      //     issue: {
      //       id: id,
      //       assignee: assigneeID,
      //     },
      //   },
      //   {
      //     "Content-Type": "application/json",
      //     withCredentials: true,
      //   }
      // );
      socket.emit(
        "change_assignee",
        {
          url: url,
          issue: {
            id: id,
            assignee: assigneeID,
          },
        },
        errorHandler
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
  const theme = createTheme({
    palette: {
      success: {
        main: "#50C878", // Replace with your desired color value
      },
      secondary: {
        main: "#808080", // Replace with your desired color value
      },
    },
  });
  return (
    <>
      {!menuButton && (
        <button
          onClick={openWorkspaceMenuHandle}
          className="open-assignees-menu-button"
        >
          <ThemeProvider theme={theme}>
            {issueObj?.assignee?.image && (
              <Badge
                color={
                  onlineUsers.includes(issueObj?.assignee?.email)
                    ? "success"
                    : "secondary"
                }
                variant="dot"
                className="assignee-online-status-dot"
              />
            )}
          </ThemeProvider>
          <img
            style={{ borderRadius: "50%" }}
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
              boxShadow: "box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px",
            },
          },
        }}
      >
        <MenuItem
          key={"null"}
          className="assignees-menu-item"
          onClick={() => saveIssueRequest(null)}
        >
          <img
            width={22}
            height={22}
            src={userImage}
            style={{ borderRadius: "50%" }}
          />
          <span style={{ marginLeft: "0.5rem" }}>No assignee</span>
        </MenuItem>
        {issues.members.map((member) => (
          <MenuItem
            key={member.user}
            className="assignees-menu-item"
            onClick={() => saveIssueRequest(member.user)}
          >
            <img
              width={22}
              height={22}
              src={member.user.image}
              style={{ borderRadius: "50%" }}
            />
            <span style={{ marginLeft: "0.5rem" }}>{member.user.email}</span>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
export default IssueAssigneeMenu;
