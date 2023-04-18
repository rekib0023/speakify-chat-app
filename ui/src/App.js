import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import RequireAuth from "./components/RequireAuth";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";

const App = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />

      {/* <Route element={<PersistLogin />}> */}
      <Route element={<RequireAuth />}>
        <Route path="/" element={<Home />} />
      </Route>
      {/* </Route> */}
    </Routes>
  );
};

export default App;
