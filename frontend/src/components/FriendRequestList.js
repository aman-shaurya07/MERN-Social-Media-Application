import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import axios from "axios";

const FriendRequestList = ({ requests }) => {
  const [requestState, setRequestState] = useState(requests);
  const socket = useSocket();

  const accept = async (requestId, userId) => {
    try {
      await axios.post(`http://localhost:5050/api/followRequests/accept/${requestId}`);
      setRequestState((prev) => prev.filter((req) => req.id !== requestId));

      if (socket) {
        const msgData = {
          senderUserId: userId,
          receiverUserId: userId,
          title: "accepted your follow request",
          msg: "",
          time: new Date().toISOString(),
        };
        socket.emit("send_notification", msgData);
      }
    } catch (err) {
      console.error("Error accepting request:", err);
    }
  };

  const decline = async (requestId, userId) => {
    try {
      await axios.post(`http://localhost:5050/api/followRequests/decline/${requestId}`);
      setRequestState((prev) => prev.filter((req) => req.id !== requestId));
    } catch (err) {
      console.error("Error declining request:", err);
    }
  };

  return (
    <div className="">
      {requestState.map((request) => (
        <div className="flex items-center justify-between text-xl" key={request.id}>
          <div className="flex items-center gap-4">
            <Link to={`/profile/${request.sender.username}`}>
              <img
                src={request.sender.avatar || "/noAvatar.png"}
                alt=""
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
            </Link>
            <Link to={`/profile/${request.sender.username}`}>
              <span className="font-semibold">
                {request.sender.name && request.sender.surname
                  ? `${request.sender.name} ${request.sender.surname}`
                  : request.sender.username}
              </span>
            </Link>
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => accept(request.id, request.sender.id)}>
              <img src="/accept.png" alt="Accept" width={20} height={20} className="cursor-pointer" />
            </button>
            <button onClick={() => decline(request.id, request.sender.id)}>
              <img src="/reject.png" alt="Reject" width={20} height={20} className="cursor-pointer" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendRequestList;
