import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLocalStorage from "../hooks/useLocalStorage";

const RequireAuth = () => {
  const location = useLocation();

  const { auth, setAuth } = useAuth();
  const [persist] = useLocalStorage("persist", false);

  // useEffect(() => {
  //   console.log(persist)
  //   if (persist) {
  //     setAuth(JSON.parse(localStorage.getItem("persistAuth")));
  //   }
  // }, []);

  return auth?.access ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ form: location }} replace />
  );
};

export default RequireAuth;
