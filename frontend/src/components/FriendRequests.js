import React, { useEffect, useState } from "react";
import FriendRequestList from "./FriendRequestList";

const FriendRequests = () => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const response = await fetch("http://localhost:5050/api/followRequests");
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const data = await response.json();
      setRequests(data);
    } catch (err) {
      console.error("Error fetching friend requests:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
      {requests.length ? (
        <FriendRequestList requests={requests} />
      ) : (
        <div>No Requests Found !!!</div>
      )}
    </div>
  );
};

export default FriendRequests;
