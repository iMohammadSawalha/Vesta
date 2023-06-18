import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Test = () => {
  const [issues, updateIssues] = useState();
  const axiosPrivate = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState(true);
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

    // if (to == "/issues") {
    //   navigate("/issues/all");
    // }
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);
  return (
    <>
      {isLoading ? <div>Loading...</div> : <div>{JSON.stringify(issues)}</div>}
    </>
  );
};
export default Test;
