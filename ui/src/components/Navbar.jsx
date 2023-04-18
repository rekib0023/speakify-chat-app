import React, { useContext, useState } from "react";
import axios from "../api/axios";
import AuthContext from "../context/AuthProvider";

const NavBar = ({ socket, isOnline, setIsOnline, setConnected }) => {
  const { auth } = useContext(AuthContext);
  const handleToggle = () => {
    axios
      .post("/online-status", JSON.stringify({}), {
        headers: { Authorization: `Bearer ${auth.access}` },
      })
      .then((response) => {
        setIsOnline(!isOnline);
        if (isOnline) {
          socket.close();
          setConnected(false);
        }
      })
      .catch((error) => console.log(error));
  };
  return (
    <nav className="flex justify-between py-6">
      <div>
        <h2 className="font-bold text-xl">Welcome {auth.full_name}!!</h2>
        <p>{auth.phone}</p>
        <p>
          {auth.email}, {auth.country}
        </p>
        <p>
          Interests:{" "}
          {auth.interest_set.map((element) => (
            <span>{element}</span>
          ))}
        </p>
      </div>
      <button onClick={handleToggle}>
        <div className="flex">
          <div
            className={`${
              isOnline ? "bg-green-600" : "bg-gray-400"
            } rounded-full w-12 h-6 relative cursor-pointer transform transition duration-300 ease-in-out`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full absolute transform transition duration-300 ease-in-out ${
                isOnline ? "right-1" : "left-1"
              } top-1`}
            ></div>{" "}
          </div>
        </div>
      </button>
    </nav>
  );
};

export default NavBar;
