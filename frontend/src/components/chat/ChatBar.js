import React, { useEffect, useRef } from "react";
import "../../styles/page.css"; // ✅ Import CSS
import SearchBar from "./SearchBar"; // ✅ Fixed import path

const ChatBar = ({ chats, onChatSelect, selectedChatId }) => {
  const chatRefs = useRef({});

  useEffect(() => {
    if (selectedChatId && chatRefs.current[selectedChatId]) {
      chatRefs.current[selectedChatId]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedChatId]);

  return (
    <div className="flex flex-col chat-container overflow-y-auto">
      <div className="w-full flex items-center justify-around p-4">
        <SearchBar onChatSelect={onChatSelect} />
      </div>
      <div className="flex flex-col gap-2 p-4 bg-white rounded-xl shadow-lg flex-1 overflow-y-auto">
        {chats &&
          chats.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 p-2 cursor-pointer hover:bg-gray-100 rounded-lg"
              onClick={() => onChatSelect(item.id)}
              ref={(el) => {
                chatRefs.current[item.id] = el;
              }}
            >
              <img
                src={item.otherUser.avatar || "/noAvatar.png"}
                className="w-8 h-8 rounded-full"
                alt="User Avatar"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <span className="text-lg text-gray-800">
                    {item.otherUser.name?.length && item.otherUser.surname?.length
                      ? `${item.otherUser.name} ${item.otherUser.surname}`
                      : item.otherUser.username}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{item.lastMessage || "No messages yet..."}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ChatBar;
