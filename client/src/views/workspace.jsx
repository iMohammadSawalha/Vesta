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
  const axiosPrivate = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState(true);
  const { setAuth, setIssues } = useAuth();
  const [errorStatus, setErrorStatus] = useState();
  const navigate = useNavigate();
  const location = useLocation();

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
            url: "new-test",
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
        setErrorStatus(error.response.status);
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

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="workspace-container">
      <Sidebar active={sidebarActive} signOut={signOut} />
      <div className="workspace-content">
        <Navbar sidebarToggler={toggleSidebar} sidebarActive={sidebarActive} />
        <Routes>
          <Route path="/issues" index element={<Kanban />} />
          <Route path="/:id" index element={<IssueBigScreen />} />
        </Routes>
      </div>
    </div>
  );
};

export default WorkSpace;
