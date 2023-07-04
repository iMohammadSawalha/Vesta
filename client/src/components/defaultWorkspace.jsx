import { useEffect, useState } from "react";
import Loading from "./loading";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
const DefaultWorkspace = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState();
  const navigate = useNavigate();
  const { auth } = useAuth();
  useEffect(() => {
    if (auth?.defaultWorkspace) setSuccess(true);
    if (!auth?.defaultWorkspace) setError(true);

    setIsLoading(false);
  }, []);
  useEffect(() => {
    if (success) return navigate("/" + auth.defaultWorkspace.url_id);
    if (error) return navigate("/workspace/new");
  }, [success, error]);

  if (isLoading) return <Loading />;
};
export default DefaultWorkspace;
