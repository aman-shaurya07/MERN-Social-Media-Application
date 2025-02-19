import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchedUsersContainer from "./SearchedUsersContainer";

const SearchBar = ({ onChatSelect }) => {
  const [searchedUsers, setSearchUsers] = useState([]);
  const [searchedText, setSearchText] = useState("");
  const [isSearchOpen, setSearchOpen] = useState(false);

  const handleChange = async () => {
    if (!searchedText.trim()) {
      setSearchUsers([]); // Clear users if search is empty
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5050/api/searchUsers?username=${searchedText}`);
      setSearchUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    setSearchText("");
    setSearchUsers([]);
  }, [isSearchOpen]);

  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex p-3 bg-white items-center rounded-xl shadow-lg"
        onClick={() => setSearchOpen((prev) => !prev)}
      >
        <input
          type="text"
          placeholder="Search for friends to chat..."
          className="h-8 bg-transparent outline-none w-full"
          onChange={(e) => {
            setSearchText(e.target.value);
            handleChange();
          }}
          spellCheck="false"
          value={searchedText}
        />
        <img src="/search.png" alt="Search" className="w-6 h-6" />
      </div>

      {isSearchOpen && (
        <div className="bg-white flex flex-col p-5 gap-4 h-auto rounded-lg shadow-lg">
          {searchedText.length > 0 && searchedUsers.length === 0 ? (
            <span className="text-lg text-center">No User Found</span>
          ) : (
            searchedUsers.map((user) => (
              <SearchedUsersContainer
                key={user.id}
                Username={user.username}
                userId={user.id}
                Avatar={user.avatar || ""}
                onChatSelect={onChatSelect}
                setSearchOpen={setSearchOpen}
                setSearchText={setSearchText}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
