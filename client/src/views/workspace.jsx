import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./workspace.css";
import Sidebar from "../components/sidebar";
import "../App.css";
import Navbar from "../components/navbar";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Loading from "../components/loading";
import useLogout from "../hooks/useLogout";
import useAuth from "../hooks/useAuth";
import { Backdrop } from "@mui/material";
import WorkspaceNotFound from "../components/workspaceNotFound";
import WorkspaceUnauthorized from "../components/workspaceUnauthorized";
import { io } from "socket.io-client";
import { flushSync } from "react-dom";
import useRefreshToken from "../hooks/useRefreshToken";
const WorkSpace = () => {
  const { url } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [joined, setJoined] = useState("no");
  const [reconnectSocket, setReconnectSocket] = useState(0);

  const refresh = useRefreshToken();
  const { auth, setAuth, setIssues, setSocket, socket, setOnlineUsers } =
    useAuth();
  useEffect(() => {
    if (reconnectSocket > 5) signOut();
    const newSocket = io("http://localhost:3000", {
      auth: {
        accessToken: auth.accessToken,
        url: url,
      },
    });
    setSocket(newSocket);
    return () => newSocket.close();
  }, [url, reconnectSocket]);
  const navigate = useNavigate();
  useEffect(() => {
    const workspaces = auth.workspaces;
    const workspace = workspaces.find((workspace) => workspace.url_id === url);
    document.title = `${workspace.name} Workspace`;
  }, []);
  useEffect(() => {
    if (!socket) return;
    const joinStatus = (status, error, onlineUsers) => {
      if (status === "yes") setJoined(status);
      if (error) errorHandler(error);
      if (onlineUsers) setOnlineUsers(onlineUsers);
    };
    socket.on("joined_workspace", (data) => {
      joinStatus(data.joined, data.error, data.onlineUsers);
    });
    socket.on("add_issue", (data) => {
      setIssues((prev) => {
        const prevState = JSON.parse(JSON.stringify(prev));
        prevState.issues.push(data.issue);
        const columnToUpdate = prevState.columns.find(
          (column) => column.id === data.issue.status
        );
        columnToUpdate.issues.push(data.issue.id);
        prevState.id_counter += 1;
        return prevState;
      });
    });
    socket.on("connect_error", (error) => {
      console.log(error.message);
      if (error.message == 403) refresh();
      setReconnectSocket((prev) => prev + 1);
    });
    socket.on("move_issue", (data) => {
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
      moveIssueClient(
        data.id,
        data.sColumn,
        data.sIndex,
        data.dColumn,
        data.dIndex
      );
    });
    socket.on("edit_issue", (data) => {
      setIssues((prev) => {
        const newState = JSON.parse(JSON.stringify(prev));
        const issueToUpdate = newState.issues.find(
          (issue) => issue.id === data.issue.id
        );
        issueToUpdate.title = data.issue.title;
        issueToUpdate.description = data.issue.description;
        if (data.issue.status != issueToUpdate.status) {
          const columnToUpdateFrom = newState.columns.find(
            (column) => column.id === issueToUpdate.status
          );
          columnToUpdateFrom.issues.splice(
            columnToUpdateFrom.issues.indexOf(data.issue.id),
            1
          );
          const columnToUpdateTo = newState.columns.find(
            (column) => column.id === data.issue.status
          );
          columnToUpdateTo.issues.splice(0, 0, data.issue.id);
          issueToUpdate.status = data.issue.status;
        }
        return newState;
      });
    });
    socket.on("change_assignee", (data) => {
      setIssues((prev) => {
        const newState = JSON.parse(JSON.stringify(prev));
        const issueToUpdate = newState.issues.find(
          (issue) => issue.id === data.issueId
        );
        if (data._id) {
          issueToUpdate.assignee = {
            _id: data._id,
            email: data.email,
            image: data.image,
          };
        } else {
          issueToUpdate.assignee = null;
        }
        return newState;
      });
    });
    socket.on("delete_issue", (data) => {
      setIssues((prev) => {
        const newIssues = JSON.parse(JSON.stringify(prev));
        const issueToUpdate = newIssues.issues.find(
          (issue) => issue.id === data.id
        );
        const issueStatus = issueToUpdate.status;
        const indexOfIssue = newIssues.issues.findIndex(
          (issue) => issue.id === data.id
        );
        newIssues.issues.splice(indexOfIssue, 1);
        const columnToUpdate = newIssues.columns.find(
          (column) => column.id === issueStatus
        );
        columnToUpdate.issues.splice(columnToUpdate.issues.indexOf(data.id), 1);
        return newIssues;
      });
    });
    socket.on("user_online", (email) => {
      setOnlineUsers((prev) => {
        return [...prev, email];
      });
    });
    socket.on("user_offline", (email) => {
      setOnlineUsers((prev) => {
        let newArray = [...prev];
        newArray = newArray.filter((array_email) => {
          return array_email != email;
        });
        return newArray;
      });
    });
  }, [socket, joined]);
  const signOut = async () => {
    await setAuth({});
    const logout = useLogout();
    await logout();
    navigate("/");
  };
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getIssues = async () => {
      try {
        const response = await axiosPrivate.post(
          "/api/workspace",
          {
            url: url,
          },
          {
            "Content-Type": "application/json",
            signal: controller.signal,
            withCredentials: true,
          }
        );
        isMounted && setIssues(response.data);
        setIsLoading(false);
      } catch (error) {
        if (
          error?.response?.status === 404 &&
          error?.response?.data?.error === "NotFound"
        )
          setNotFound(true);
        if (
          error?.response?.status === 403 &&
          error?.response?.data?.error === "NotMember"
        )
          setUnauthorized(true);
        setIsLoading(false);
      }
    };
    getIssues();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const [sidebarActive, setSidebarActive] = useState(false);
  const toggleSidebar = () => {
    sidebarActive ? setSidebarActive(false) : setSidebarActive(true);
  };
  const location = useLocation();
  useEffect(() => {
    setSidebarActive(false);
  }, [location.pathname]);
  if (isLoading) return <Loading />;

  if (notFound) return <WorkspaceNotFound />;

  if (unauthorized) return <WorkspaceUnauthorized />;
  return (
    <div className="workspace-container">
      <Backdrop
        sx={{ backgroundColor: "transparent", zIndex: 2 }}
        open={sidebarActive}
        onClick={() => setSidebarActive(false)}
      ></Backdrop>
      <Sidebar active={sidebarActive} signOut={signOut} />
      <div className="workspace-content">
        <Navbar sidebarToggler={toggleSidebar} sidebarActive={sidebarActive} />
        <Outlet />
      </div>
    </div>
  );
};

export default WorkSpace;
