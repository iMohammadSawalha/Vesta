import axios from "../api/axios";

const useLogout = () => {
  const logout = async () => {
    try {
      const response = axios.post("api/user/logout", {
        withCredentials: true,
      });
    } catch (error) {
      //console.error(error);
    }
  };
  return logout;
};
export default useLogout;
