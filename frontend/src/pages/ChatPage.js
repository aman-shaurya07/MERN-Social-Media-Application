import React, { useEffect, useState } from "react";
import LeftMenu from "../components/leftMenu/LeftMenu"; // ✅ Fixed import path
import BottomMenu from "../components/bottomMenu/BottomMenu";
import ChatBar from "../components/chat/ChatBar";
import MessageBar from "../components/chat/MessageBar";
import "../styles/page.css"; // ✅ Import CSS

const ChatPage = () => {
  const userId = localStorage.getItem("userId"); // ✅ Getting userId from localStorage

  const [allChats, setAllChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [otherUserName, setOtherUserName] = useState("");
  const [otherUserAvatar, setOtherUserAvatar] = useState("");
  const [otherUserId, setOtherUserId] = useState("");

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch("http://localhost:5050/api/getChats");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const userChats = await response.json();

        const chats = userChats.map((chat) => {
          const otherUser = chat.user1Id === userId ? chat.user2 : chat.user1;
          return {
            id: chat.id,
            otherUser,
            messages: chat.messages,
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt,
            lastMessage: chat.lastMessage,
          };
        });
        setAllChats(chats);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, [userId]);

  const handleChatSelect = async (chatId) => {
    let chatVar = allChats.find((chat) => chat.id === chatId);
    let newChat;

    if (!chatVar) {
      try {
        const response = await fetch(`http://localhost:5050/api/getChat/${chatId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const userChat = await response.json();
        const otherUser = userChat.user1Id === userId ? userChat.user2 : userChat.user1;
        newChat = {
          id: userChat.id,
          otherUser,
          messages: userChat.messages,
          createdAt: userChat.createdAt,
          updatedAt: userChat.updatedAt,
          lastMessage: userChat.lastMessage,
        };
      } catch (error) {
        console.error("Error fetching chat:", error);
        return;
      }
    } else {
      newChat = chatVar;
    }

    setSelectedChat(chatId);
    setMessages(newChat.messages);
    const temp =
      newChat.otherUser.name?.length && newChat.otherUser.surname?.length
        ? `${newChat.otherUser.name} ${newChat.otherUser.surname}`
        : newChat.otherUser.username;
    setOtherUserName(temp);
    setOtherUserAvatar(newChat.otherUser.avatar);
    setOtherUserId(newChat.otherUser.id);

    if (!chatVar) {
      setAllChats((prevChats) => [newChat, ...prevChats]);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 pt-6 pb-12 w-full">
      {/* Left Sidebar */}
      <div className="hidden lg:block w-1/4">
        <LeftMenu />
      </div>

      {/* Chat Layout */}
      <div className="flex flex-col lg:flex-row flex-1 gap-4 lg:gap-6">
        <div className="lg:h-[600px] flex-1 lg:w-1/3 bg-white rounded-xl shadow-lg overflow-y-auto chat-container">
          <ChatBar chats={allChats} onChatSelect={handleChatSelect} selectedChatId={selectedChat} />
        </div>
        <div className="lg:h-[600px] flex-1 lg:w-2/3 bg-white rounded-xl shadow-lg overflow-y-scroll message-container">
          <MessageBar
            Messages={messages}
            otherUserName={otherUserName}
            otherUserId={otherUserId || ""}
            chatId={selectedChat || ""}
            avatar={otherUserAvatar}
          />
        </div>
      </div>

      <BottomMenu />
    </div>
  );
};

export default ChatPage;
