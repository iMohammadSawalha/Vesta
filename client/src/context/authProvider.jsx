import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [issues, setIssues] = useState({});

  return (
    <AuthContext.Provider value={{ auth, setAuth, issues, setIssues }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
