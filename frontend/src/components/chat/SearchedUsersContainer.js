import React from "react";
import axios from "axios";

const SearchedUsersContainer = ({
  Username,
  userId,
  Avatar,
  onChatSelect,
  setSearchOpen,
  setSearchText,
}) => {
  const myUserId = localStorage.getItem("userId"); // ✅ Get userId from localStorage

  const handleClick = async () => {
    if (myUserId !== userId) {
      try {
        const response = await axios.post(`http://localhost:5050/api/createChat/${userId}`);

        if (!response.data) {
          throw new Error("Failed to create chat");
        }

        const newChat = response.data;

        setSearchOpen(false);
        setSearchText("");
        onChatSelect(newChat.id);

        console.log("Chat created:", newChat);
      } catch (error) {
        console.error("Error creating chat:", error);
      }
    }
  };

  return (
    <div className="flex gap-6">
      <img
        src={Avatar || "/noAvatar.png"}
        alt="User Avatar"
        className="h-6 w-6 rounded-full ring-2 cursor-pointer"
        onClick={handleClick}
      />

      <span className="text-lg text-gray-600 cursor-pointer" onClick={handleClick}>
        {Username}
      </span>
    </div>
  );
};

export default SearchedUsersContainer;
