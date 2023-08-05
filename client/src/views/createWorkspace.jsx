import { useEffect, useState } from "react";
import "./login.css";
import "../components/buttons.css";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { isValidWorkspaceName } from "../helpers/global";
import { useNavigate } from "react-router-dom";
import { LinearProgress } from "@mui/material";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";
const CreateWorkspace = () => {
  const axiosPrivate = useAxiosPrivate();
  const [created, setCreated] = useState(false);
  const [data, setData] = useState({});
  const [hasError, setHasError] = useState(true);
  const [nameError, setNameError] = useState(false);
  const [urlError, setUrlError] = useState(false);
  const [urlUsedError, setUrlUsedError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceUrl, setWorkspaceUrl] = useState("Vesta.com/");
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const controller = new AbortController();
  useEffect(() => {
    document.title = "Create new Workspace";
  }, []);
  const createWorkspaceHandle = async () => {
    if (!isValidWorkspaceName.test(workspaceName)) {
      setNameError(true);
      setHasError(true);
    }
    if (!isValidWorkspaceName.test(workspaceUrl.slice(10))) {
      setUrlError(true);
      setHasError(true);
    }
    if (hasError) return;
    try {
      if (loading) return;
      setLoading(true);
      const response = await axiosPrivate.post(
        "/api/workspace/new",
        JSON.stringify({ name: workspaceName, url: workspaceUrl.slice(10) }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
          signal: controller.signal,
        }
      );
      setData(response.data);
      setLoading(false);
      setCreated(true);
    } catch (error) {
      setLoading(false);
      if (error.response.status === 409) {
        setUrlUsedError(true);
      }
      //For Testing Logs
    }
  };
  useEffect(() => {
    if (created) {
      setAuth((prev) => {
        return {
          ...prev,
          ...data,
        };
      });
      navigate("/");
    }
  }, [created]);
  useEffect(() => {
    if (isValidWorkspaceName.test(workspaceName)) {
      setHasError(true);
      setNameError(false);
    }
    if (isValidWorkspaceName.test(workspaceUrl.slice(10))) {
      setHasError(true);
      setUrlError(false);
      setUrlUsedError(false);
    }
    if (
      isValidWorkspaceName.test(workspaceName) &&
      isValidWorkspaceName.test(workspaceUrl.slice(10))
    )
      setHasError(false);
    return () => {
      controller.abort();
    };
  }, [workspaceName, workspaceUrl]);
  const workspaceUrlChangeHandle = (value) => {
    setWorkspaceUrl("Vesta.com/" + value.slice(10));
  };
  const navigateBackHandle = () => {
    navigate("/");
  };
  const signOut = async () => {
    await setAuth({});
    const logout = useLogout();
    await logout();
    navigate("/");
  };
  return (
    <div className="auth-container">
      <div className="not-found-buttons-group">
        <button className="logout-button-a" onClick={signOut}>
          <div className="logout-button-a-icon">
            <svg viewBox="0 0 512 512">
              <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
            </svg>
          </div>

          <div className="logout-button-a-text">Logout</div>
        </button>
        <button
          style={{ marginLeft: "auto" }}
          className="go-back-button"
          onClick={navigateBackHandle}
        >
          <svg
            height="16"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            viewBox="0 0 1024 1024"
          >
            <path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path>
          </svg>
          <span>Back</span>
        </button>
      </div>
      {loading && (
        <div
          style={{
            width: "100%",
            position: "absolute",
            bottom: "0%",
            color: "#645bff",
          }}
        >
          <LinearProgress color="inherit" />
        </div>
      )}
      <div className="auth-content">
        <h2 style={{ marginRight: "2rem", width: "100%", fontWeight: "400" }}>
          Create you workspace
        </h2>
        <input
          className={nameError ? "auth-input  input-error" : "auth-input "}
          placeholder="Workspace name"
          value={workspaceName}
          onChange={(e) => setWorkspaceName(e.target.value)}
        />
        <div className="email-input-error-placeholder">
          {nameError &&
            "Please enter a name with at least 3 letters, no special characters or numbers"}
        </div>
        <input
          className={
            nameError
              ? "auth-input auth-input-email input-error"
              : "auth-input auth-input-email"
          }
          placeholder="Workspace URL"
          value={workspaceUrl}
          onChange={(e) => workspaceUrlChangeHandle(e.target.value)}
        />
        <div className="email-input-error-placeholder">
          {urlError &&
            "Please enter a url-name with at least 3 letters, no special characters or numbers"}
          {urlUsedError && "URL already in use try another one"}
        </div>
        <button
          className="auth-button slide-center-button"
          onClick={createWorkspaceHandle}
        >
          Continue
        </button>
      </div>
    </div>
  );
};
export default CreateWorkspace;
