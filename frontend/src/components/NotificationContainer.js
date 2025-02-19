import React, { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

const NotificationContainer = () => {
  const socket = useSocket();
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("http://localhost:5050/api/getNotifications");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  // Handle incoming socket notifications
  useEffect(() => {
    if (socket) {
      socket.on("receive_notification", (data) => {
        setNotifications((prev) => [data, ...prev]);
      });

      return () => {
        socket.off("receive_notification");
      };
    }
  }, [socket]);

  // ✅ Mark Notification as Read
  const markAsRead = async (id) => {
    try {
      await fetch(`http://localhost:5050/api/markAsRead/${id}`, {
        method: "PUT",
      });

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id ? { ...notification, unread: false } : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-8 bg-white rounded-lg shadow-lg">
      {notifications.length > 0 ? (
        notifications.map(({ id, sender, title, message, time, unread }) => (
          <div
            key={id}
            className={`flex gap-3 ${unread ? "bg-gray-100" : "bg-white"}`}
            onClick={() => markAsRead(id)}
          >
            <Link to={`/profile/${sender.username}`}>
              <img src={sender.avatar || "/noAvatar.png"} className="w-8 h-8 rounded-full" alt="" />
            </Link>

            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <Link to={`/profile/${sender.username}`}>
                  <span className="text-xl text-gray-600">
                    {sender.name && sender.surname ? `${sender.name} ${sender.surname}` : sender.username}
                  </span>
                </Link>

                <span className="text-lg text-gray-700">{title}</span>
              </div>
              <p>{message}</p>
              <small>{formatDistanceToNow(new Date(time), { addSuffix: true })}</small>
            </div>
          </div>
        ))
      ) : (
        <div>No Notifications Found !!</div>
      )}
    </div>
  );
};

export default NotificationContainer;
