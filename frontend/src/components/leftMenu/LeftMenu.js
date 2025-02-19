import React from "react";
import { Link } from "react-router-dom";
import ProfileCard from "./ProfileCard";

const LeftMenu = ({ type }) => {
  const username = localStorage.getItem("username");

  if (!username) return null;

  return (
    <div className="hidden lg:flex flex-col gap-6">
      {type !== "profile" && <ProfileCard />}

      <div className="flex flex-col justify-between gap-16 lg:p-6 2xl:p-12 bg-white rounded-lg shadow-md text-sm text-gray-500">
        <Link to="/" className="flex items-center gap-2">
          <img src="/home.png" alt="Homepage" className="w-6 h-6" />
          <span className="hidden text-xl xl:block">Homepage</span>
        </Link>

        <Link to="/search" className="flex items-center gap-2">
          <img src="/search.png" alt="search" className="w-6 h-6" />
          <span className="hidden text-xl xl:block">Search</span>
        </Link>

        <Link to="/notifications" className="flex items-center gap-2">
          <img src="/notifications.png" alt="notification" className="w-6 h-6" />
          <span className="hidden text-xl xl:block">Notifications</span>
        </Link>

        <Link to="/messages" className="flex items-center gap-2">
          <img src="/messages.png" alt="messages" className="w-6 h-6" />
          <span className="hidden text-xl xl:block">Messages</span>
        </Link>

        <Link to="/bookmark" className="flex items-center gap-2">
          <img src="/bookBlue.png" alt="messages" className="w-6 h-6" />
          <span className="hidden text-xl xl:block">Bookmarks</span>
        </Link>

        <Link to={`/profile/${username}`} className="flex items-center gap-2">
          <img src="/noAvatar.png" alt="Avatar" className="w-6 h-6" />
          <span className="hidden text-xl xl:block">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default LeftMenu;
