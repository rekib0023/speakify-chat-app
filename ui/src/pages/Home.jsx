import Container from "../components/Container";

import React, { useContext, useState, useEffect } from "react";
import NavBar from "../components/Navbar";
import AuthContext from "../context/AuthProvider";

const Home = () => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [socket, setSocket] = useState(null);

  const { auth } = useContext(AuthContext);
  const [isOnline, setIsOnline] = useState(auth.is_online);

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const [partnerDetails, setPartnerDetails] = useState(null);

  const url = "ws://127.0.0.1:8000/ws/chat/?userId=" + auth.id;

  const handleClick = () => {
    setConnecting(true);
    const ws = new WebSocket(url);
    ws.onopen = () => {
      setSocket(ws);
      ws.send(JSON.stringify({ type: "send_user_details", message: "" }));
    };

    if (socket !== null) {
      socket.onopen = () => {};
    }
  };

  useEffect(() => {
    if (socket !== null) {
      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      socket.onmessage = (event) => {
        console.log(event);
        const message = JSON.parse(event.data).message;
        if (message.type === "user_details") {
          setPartnerDetails(message);

          setConnected(true);
          setConnecting(false);
        } else if (message.type == "chat_message") {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: message.message, from: "sender" },
          ]);
        }
      };
    }
  }, [socket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.send(JSON.stringify({ type: "chat_message", message: inputValue }));
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: inputValue, from: "self" },
    ]);
    setInputValue("");
  };

  const handleDisconnect = () => {
    socket.close();
    setConnected(false);
  };

  useEffect(() => {
    if (connected === false) {
      setPartnerDetails(null);
      setMessages([]);
    }
  }, [connected]);

  return (
    <Container>
      <NavBar
        socket={socket}
        isOnline={isOnline}
        setIsOnline={setIsOnline}
        setConnected={setConnected}
      />
      <div>
        <div className="mb-2">
          <button
            className={`mr-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
              connected ? "bg-green-500" : ""
            }${
              !isOnline ? "disabled:opacity-75 disabled:cursor-not-allowed" : ""
            }`}
            disabled={!isOnline}
            onClick={handleClick}
          >
            {connecting ? "Connecting" : connected ? "Reconnect" : "Connect"}
          </button>
          {connected && (
            <button
              className="text-white font-bold py-2 px-4 rounded bg-red-500"
              onClick={handleDisconnect}
            >
              Disconnect
            </button>
          )}
        </div>
        {partnerDetails && (
          <p className="mb-4">
            Connected to: {partnerDetails.name}, {partnerDetails.gender} |{" "}
            {partnerDetails.country}
          </p>
        )}
      </div>
      {connected && (
        <div className="border rounded border-slate-800">
          <ul className="border p-4">
            {messages.map((message, i) => (
              <li
                key={i}
                className={
                  message.from === "self"
                    ? "bg-blue-500 text-white py-1 px-4 rounded-full mb-2 ml-auto max-w-xs"
                    : "bg-gray-200 py-2 px-4 rounded-full mb-2 mr-auto max-w-xs"
                }
              >
                {message.text}
              </li>
            ))}
          </ul>
          <form onSubmit={handleSubmit}>
            <textarea
              className="border border-gray-300 rounded-lg p-1 w-full"
              placeholder="Type your message here..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <div className="flex">
              <button
                className="ml-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4 mb-4"
                type="submit"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </Container>
  );
};

export default Home;
