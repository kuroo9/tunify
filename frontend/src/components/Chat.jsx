import React, { useEffect, useState } from "react";
import { ChatData } from "../context/ChatContext";

const Chat = ({ currentUser }) => {
  const { messages, activeUsers, sendMessage } = ChatData();
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim() === "") return;

    // Send the message
    sendMessage(message);

    setMessage(""); // Clear the input field
  };

  return (
    <div className="w-full bg-black text-white p-4 rounded-md">
      {/* Active Users */}
      <div className="mb-4">
        <p className="font-semibold text-gray-400">Active Users:</p>
        <ul className="text-sm">
          {activeUsers.map((user) => (
            <li key={user} className="text-gray-400">
              {user}
            </li>
          ))}
        </ul>
      </div>

      {/* Messages */}
      <div className="mb-4 overflow-y-auto h-48 bg-gray-900 p-2 rounded-md">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${
              msg.senderId === currentUser._id ? "text-right" : "text-left"
            }`}
          >
            <strong className="text-gray-400">{msg.senderName}: </strong>
            <span className="text-gray-500">{msg.message}</span>
            <div className="text-xs text-gray-600">
              {msg.timestamp
                ? new Date(msg.timestamp).toLocaleTimeString()
                : "Unknown time"}
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow p-2 bg-gray-800 text-white rounded"
        />
        <button
          onClick={handleSendMessage}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;