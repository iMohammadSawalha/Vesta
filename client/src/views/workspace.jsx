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
const WorkSpace = () => {
  const { url } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const { auth, setAuth, setIssues } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const workspaces = auth.workspaces;
    const workspace = workspaces.find((workspace) => workspace.url_id === url);
    document.title = `${workspace.name} Workspace`;
  }, []);
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
