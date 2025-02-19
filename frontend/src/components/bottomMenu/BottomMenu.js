import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BottomMenu = () => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId || !token) return;

      try {
        const response = await fetch(`http://localhost:5050/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, [userId]);

  if (!userId) return null;

  return (
    <>
      {/* Bottom navigation bar for smaller screens */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2">
        <Link to="/" className="flex flex-col items-center gap-1">
          <img src="/home.png" alt="Homepage" className="w-6 h-6" />
          <span className="text-xs text-gray-500">Home</span>
        </Link>

        <Link to="/search" className="flex flex-col items-center gap-1">
          <img src="/search.png" alt="Search" className="w-6 h-6" />
          <span className="text-xs text-gray-500">Search</span>
        </Link>

        <Link to="/notifications" className="flex flex-col items-center gap-1">
          <img src="/notifications.png" alt="Notifications" className="w-6 h-6" />
          <span className="text-xs text-gray-500">Notifications</span>
        </Link>

        <Link to="/messages" className="flex flex-col items-center gap-1">
          <img src="/messages.png" alt="Messages" className="w-6 h-6" />
          <span className="text-xs text-gray-500">Messages</span>
        </Link>

        <Link to="/bookmark" className="flex flex-col items-center gap-1">
          <img src="/bookBlue.png" alt="Bookmarks" className="w-6 h-6" />
          <span className="text-xs text-gray-500">Bookmarks</span>
        </Link>

        <Link to={`/profile/${user?.username}`} className="flex flex-col items-center gap-1">
          <img src={user?.avatar || "/noAvatar.png"} alt="Avatar" className="w-6 h-6 rounded-full object-cover" />
          <span className="text-xs text-gray-500">Profile</span>
        </Link>
      </div>
    </>
  );
};

export default BottomMenu;
