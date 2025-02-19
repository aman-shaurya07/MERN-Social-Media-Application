import React, { useState } from "react";
import axios from "axios";
import { useSocket } from "../../context/SocketContext";

const FriendRequestList = ({ requests }) => {
  const [requestState, setRequestState] = useState(requests);
  const myUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const socket = useSocket();

  const accept = async (requestId, userId) => {
    setRequestState((prev) => prev.filter((req) => req.id !== requestId));

    try {
      await axios.post(`http://localhost:5050/api/users/${userId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (socket) {
        const msgData = {
          senderUserId: myUserId,
          receiverUserId: userId,
          title: "accepted your follow request",
          msg: "",
          time: new Date().toISOString(),
        };
        socket.emit("send_notification", msgData);

        const msgData2 = {
          senderUserId: userId,
          receiverUserId: myUserId,
          title: "started following you",
          msg: "",
          time: new Date().toISOString(),
        };
        socket.emit("send_notification", msgData2);
      }

      await axios.post("http://localhost:5050/api/notifications", {
        title: "accepted your follow request",
        message: "",
        senderId: myUserId,
        receiverId: userId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await axios.post("http://localhost:5050/api/notifications", {
        title: "started following you",
        message: "",
        senderId: userId,
        receiverId: myUserId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const decline = async (requestId, userId) => {
    setRequestState((prev) => prev.filter((req) => req.id !== requestId));

    try {
      await axios.post(`http://localhost:5050/api/users/${userId}/decline`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error declining friend request:", error);
    }
  };

  return (
    <div>
      {requestState.map((request) => (
        <div className="flex items-center justify-between" key={request.id}>
          <div className="flex items-center gap-4">
            <img
              src={request.sender.avatar || "/noAvatar.png"}
              alt="Avatar"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-semibold">
              {request.sender.name && request.sender.surname
                ? `${request.sender.name} ${request.sender.surname}`
                : request.sender.username}
            </span>
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => accept(request.id, request.sender.id)}>
              <img
                src="/accept.png"
                alt="Accept"
                width={20}
                height={20}
                className="cursor-pointer"
              />
            </button>
            <button onClick={() => decline(request.id, request.sender.id)}>
              <img
                src="/reject.png"
                alt="Decline"
                width={20}
                height={20}
                className="cursor-pointer"
              />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendRequestList;
