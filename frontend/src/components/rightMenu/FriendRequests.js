import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import FriendRequestList from "./FriendRequestList";

const FriendRequests = ({ type = "Default Value" }) => {
  const [requests, setRequests] = useState([]);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFriendRequests = async () => {
      if (!userId || !token) return;

      try {
        const response = await axios.get("http://localhost:5050/api/users/friend-requests", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };

    fetchFriendRequests();
  }, [userId]);

  return (
    <div className={`p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4 ${type === "notification" ? "hidden" : "none"}`}>
      {/* TOP */}
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500">Friend Requests</span>
        <Link to="/" className="text-blue-500 text-xs">
          See all
        </Link>
      </div>
      {/* USER LIST */}
      {requests.length ? (
        <FriendRequestList requests={requests} />
      ) : (
        <div>No Requests Found !!!</div>
      )}
    </div>
  );
};

export default FriendRequests;
