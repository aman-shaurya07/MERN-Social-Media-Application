import React from "react";
import { Link } from "react-router-dom"; // ✅ Use react-router-dom for navigation

const SearchedUsersContainer = ({ Username, Avatar }) => {
  return (
    <Link to={`/profile/${Username}`}>
      <div className="flex gap-6">
        <img
          src={Avatar || "/noAvatar.png"}
          alt="User Avatar"
          className="h-8 w-8 rounded-full ring-2-black"
        />
        <span className="text-xl text-gray-800">{Username}</span>
      </div>
    </Link>
  );
};

export default SearchedUsersContainer;
