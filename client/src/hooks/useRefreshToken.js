import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const refresh = async () => {
    const response = await axios.post("/api/user/refreshtoken");
    setAuth((prev) => {
      return {
        ...prev,
        accessToken: response.data.accessToken,
        workspaces: response.data.workspaces,
        defaultWorkspace: response.data.defaultWorkspace,
        user: response.data.user,
      };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
