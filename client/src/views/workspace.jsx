import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Kanban from "../components/kanban";
import IssueBigScreen from "../components/issueBigScreen";
import { useEffect, useState } from "react";
import "./workspace.css";
import Sidebar from "../components/sidebar";
import "../App.css";
import Navbar from "../components/navbar";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Loading from "../components/loading";
import useLogout from "../hooks/useLogout";
import useAuth from "../hooks/useAuth";
const WorkSpace = () => {
  const [issues, updateIssues] = useState();
  const axiosPrivate = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState(true);
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const to = location.pathname;

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
        const response = await axiosPrivate.get("/data", {
          signal: controller.signal,
          withCredentials: true,
        });
        isMounted && updateIssues(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };
    getIssues();

    if (to == "/issues") {
      navigate("/issues/all");
    }
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const [sidebarActive, setSidebarActive] = useState(false);
  const toggleSidebar = () => {
    sidebarActive ? setSidebarActive(false) : setSidebarActive(true);
  };

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="workspace-container">
      <Sidebar
        updateIssues={updateIssues}
        issues={issues}
        active={sidebarActive}
        signOut={signOut}
      />
      <div className="workspace-content">
        <Navbar sidebarToggler={toggleSidebar} sidebarActive={sidebarActive} />
        <Routes>
          <Route
            path="/all"
            index
            element={<Kanban issues={issues} updateIssues={updateIssues} />}
          />
          <Route
            path="/:id"
            index
            element={
              <IssueBigScreen issues={issues} updateIssues={updateIssues} />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default WorkSpace;
