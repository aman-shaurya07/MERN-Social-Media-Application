import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { useSocket } from "../../context/SocketContext"; // ✅ Fixed import path

const MessageBar = ({ Messages, otherUserName, chatId, otherUserId, avatar }) => {
  const socket = useSocket();
  const userId = localStorage.getItem("userId"); // ✅ Get userId from localStorage
  const [textArea, setTextArea] = useState("");
  const [messages, setMessages] = useState(Messages);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages(Messages);
  }, [Messages]);

  useEffect(() => {
    if (socket) {
      socket.on("receive_message", (data) => {
        if (data.chatId === chatId) {
          setMessages((prevMessages) => [...prevMessages, data]);
        }
      });

      return () => {
        socket.off("receive_message");
      };
    }
  }, [socket, chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!textArea.trim().length) return;

    const newMessage = {
      senderId: userId,
      receiverUserId: otherUserId,
      content: textArea,
      createdAt: new Date(),
      chatId: chatId,
    };

    try {
      await axios.post("http://localhost:5050/api/messages", {
        chatId,
        content: textArea,
      });

      socket?.emit("send_message", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setTextArea("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col message-container lg:h-[600px]">
      <div className="flex-1 p-4 overflow-y-scroll bg-gray-100">
        <div className="flex flex-col gap-3">
          {messages &&
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.senderId === userId ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    message.senderId === userId
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(message.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="bg-white p-4 flex items-center gap-3">
        <img
          src={avatar || "./noAvatar.png"}
          alt="User Avatar"
          className="w-10 h-10 rounded-full"
        />
        <form className="flex-1 flex" onSubmit={handleSendMessage}>
          <textarea
            value={textArea}
            onChange={(e) => setTextArea(e.target.value)}
            placeholder={`Message ${otherUserName}`}
            className="flex-1 border rounded-lg p-2 resize-none"
          />
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageBar;
