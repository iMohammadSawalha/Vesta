import useAxiosPrivate from "../hooks/useAxiosPrivate";

const useDeleteWorkspace = () => {
  const axiosPrivate = useAxiosPrivate();
  const deleteWorkspace = async (url) => {
    try {
      const response = await axiosPrivate.post(
        "api/workspace/delete",
        {
          url: url,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      return response.status;
    } catch (error) {
      return error.response.status;
    }
  };
  return deleteWorkspace;
};
export default useDeleteWorkspace;
