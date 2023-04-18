import useAuth from "./useAuth";

const useLogout = () => {
  const { setAuth } = useAuth();

  const logout = () => {
    setAuth({});
    try {
      localStorage.clear()
    } catch (error) {
      console.error(error);
    }
  };

  return logout;
};

export default useLogout;
