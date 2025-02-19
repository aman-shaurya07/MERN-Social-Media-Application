import React, { useState } from "react";
import NotificationContainer from "./NotificationContainer"; // ✅ Fixed import typo
import FriendRequests from "./FriendRequests";

const Middle = () => {
  const [open, setOpen] = useState(1);

  return (
    <div className="flex flex-col gap-4">
      {/* Toggle Buttons */}
      <div className="flex">
        <div
          className={`flex-1 flex items-center justify-around p-4 bg-white text-2xl rounded-lg shadow-sm cursor-pointer ${
            open ? "border-2" : ""
          }`}
          onClick={() => setOpen(1)}
        >
          <h1 className="text-gray-600">Notifications</h1>
        </div>
        <div
          className={`flex-1 flex items-center justify-around p-4 bg-white text-2xl rounded-lg shadow-sm cursor-pointer ${
            !open ? "border-2" : ""
          }`}
          onClick={() => setOpen(0)}
        >
          <h1 className="text-gray-600">Follow Requests</h1>
        </div>
      </div>

      {/* Conditional Content */}
      {open ? <NotificationContainer /> : <FriendRequests />}
    </div>
  );
};

export default Middle;
