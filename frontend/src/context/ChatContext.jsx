import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const ChatContext = createContext();

export const ChatProvider = ({ children, currentUser }) => {
  const [messages, setMessages] = useState([]); // Messages array
  const [activeUsers, setActiveUsers] = useState([]); // Active users array
  const [socket, setSocket] = useState(null); // Socket instance

  useEffect(() => {
    if (!currentUser) return;

    // Connect to the Socket.IO serversa
    const newSocket = io("http://localhost:5000"); // Replace with your backend URL
    setSocket(newSocket);

    // Add the current user to active users
    newSocket.emit("addUser", currentUser._id);

    // Listen for chat history
    newSocket.on("getChatHistory", (chatHistory) => {
      setMessages(chatHistory);
    });

    // Listen for active users
    newSocket.on("getActiveUsers", (users) => {
      setActiveUsers(users);
    });

    // Listen for incoming messages
    newSocket.on("getMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => newSocket.close(); // Cleanup on unmount
  }, [currentUser]);

  // Send a message
  const sendMessage = (message) => {
    if (!socket || !currentUser) return;

    socket.emit("sendMessage", {
      senderId: currentUser._id,
      senderName: currentUser.name, // Include the sender's name
      message,
    });
    setMessages((prev) => [
      ...prev,
      {
        senderId: currentUser._id,
        senderName: currentUser.name,
        message,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <ChatContext.Provider
      value={{ messages, activeUsers, sendMessage }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatData = () => useContext(ChatContext);