import { createContext, useEffect, useState } from "react";
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [issues, setIssues] = useState({});
  const [socket, setSocket] = useState();
  const [onlineUsers, setOnlineUsers] = useState([]);
  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        issues,
        setIssues,
        socket,
        setSocket,
        onlineUsers,
        setOnlineUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
