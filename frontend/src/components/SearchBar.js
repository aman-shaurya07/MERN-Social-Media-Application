import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchedUsersContainer from "./SearchedUsersContainer";

const SearchBar = () => {
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [searchedText, setSearchedText] = useState("");
  const [isSearchOpen, setSearchOpen] = useState(false);
  const token = localStorage.getItem("token"); // ✅ Get user token

  const handleChange = async () => {
    if (searchedText.trim().length > 0) {
      try {
        const response = await axios.get(
          `http://localhost:5050/api/users/search/${searchedText}`,
          {
            headers: { Authorization: `Bearer ${token}` }, // ✅ Send token
          }
        );

        setSearchedUsers(response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setSearchedUsers([]);
      }
    } else {
      setSearchedUsers([]);
    }
  };

  useEffect(() => {
    setSearchedText("");
    setSearchedUsers([]);
  }, [isSearchOpen]);

  return (
    <div className="flex flex-col gap-4">
      {/* Search Input Field */}
      <div
        className="flex p-3 bg-white items-center rounded-xl shadow-lg"
        onClick={() => setSearchOpen((prev) => !prev)}
      >
        <input
          type="text"
          value={searchedText}
          placeholder="Search for other users..."
          className="h-8 bg-transparent outline-none w-full"
          onChange={(e) => {
            setSearchedText(e.target.value);
            handleChange();
          }}
          spellCheck="false"
        />
        <img src="/search.png" alt="Search" className="w-6 h-6" />
      </div>

      {/* Search Results */}
      {isSearchOpen && (
        <div className="bg-white flex flex-col p-8 gap-8 h-auto rounded-lg shadow-lg">
          {searchedText.length > 0 && searchedUsers.length === 0 ? (
            <span className="text-2xl text-center">No User Found</span>
          ) : (
            searchedUsers.map((user) => (
              <SearchedUsersContainer
                key={user.id}
                Username={user.username}
                Avatar={user.avatar || ""}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
