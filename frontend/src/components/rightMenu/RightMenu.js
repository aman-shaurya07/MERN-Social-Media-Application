import React, { useEffect, useState } from "react";
import axios from "axios";
import Birthdays from "./Birthdays";
import FriendRequests from "./FriendRequests";
import UserInfoCard from "./UserInfoCard";
import UserMediaCard from "./UserMediaCard";

const RightMenu = ({ type }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const storedUserId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      if (!storedUserId) return;

      try {
        const response = await axios.get(`http://localhost:5050/api/users/${storedUserId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {user && (
        <>
          <UserInfoCard userId={user.id} />
          <UserMediaCard userId={user.id} />
        </>
      )}
      <FriendRequests type={type} />
      <Birthdays />
    </div>
  );
};

export default RightMenu;
