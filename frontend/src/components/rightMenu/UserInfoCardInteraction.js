// import React, { useState } from "react";
// import axios from "axios";
// import { useSocket } from "../../context/SocketContext";

// const UserInfoCardInteraction = ({ userId, isUserBlocked, isFollowing, isFollowingSent }) => {
//   const [userState, setUserState] = useState({
//     following: isFollowing,
//     blocked: isUserBlocked,
//     followingRequestSent: isFollowingSent,
//   });

//   console.log("following", userState.following);
//   console.log("blocked", userState.blocked);
//   console.log("followingRequestSent", userState.followingRequestSent);

//   // Correctly getting user details from localStorage
//   const myUserId = localStorage.getItem("userId");
//   const token = localStorage.getItem("token");
//   const username = localStorage.getItem("username");

//   const socket = useSocket();

//   const follow = async () => {
//     const shouldSendNotification = !userState.following && !userState.followingRequestSent;
//     setUserState((prev) => ({
//       ...prev,
//       following: prev.following && false,
//       followingRequestSent: !prev.following && !prev.followingRequestSent ? true : false,
//     }));

//     try {
//       await axios.post(`http://localhost:6000/api/users/${userId}/follow`, {}, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setUserState((prev) => ({
//         ...prev,
//         following: !prev.following,
//         followingRequestSent: false,
//       }));

//       if (shouldSendNotification) {
//         handleClick();
//       }
//     } catch (err) {
//       console.error("Error following user:", err);
//     }
//   };

//   const handleClick = async () => {
//     console.log(userState.followingRequestSent);

//     if (socket) {
//       const msgData = {
//         senderUserId: myUserId,
//         receiverUserId: userId,
//         title: "sent you a follow request",
//         msg: "",
//         time: new Date().toISOString(),
//       };
//       socket.emit("send_notification", msgData);
//     }

//     await axios.post("http://localhost:6000/api/notifications", {
//       title: "sent you a follow request",
//       message: "",
//       senderId: myUserId,
//       receiverId: userId,
//     }, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//   };

//   const block = async () => {
//     setUserState((prev) => ({ ...prev, blocked: !prev.blocked }));

//     try {
//       await axios.post(`http://localhost:6000/api/users/${userId}/block`, {}, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//     } catch (err) {
//       console.error("Error blocking user:", err);
//     }
//   };

//   return (
//     <>
//       <button
//         onClick={follow}
//         className="w-full bg-blue-500 text-white text-sm rounded-md p-2"
//       >
//         {userState.following
//           ? "Following"
//           : userState.followingRequestSent
//           ? "Friend Request Sent"
//           : "Follow"}
//       </button>

//       <button onClick={block} className="self-end">
//         <span className="text-red-400 text-xs cursor-pointer">
//           {userState.blocked ? "Unblock User" : "Block User"}
//         </span>
//       </button>
//     </>
//   );
// };

// export default UserInfoCardInteraction;




import React, { useState } from "react";
import axios from "axios";
import { useSocket } from "../../context/SocketContext";

const UserInfoCardInteraction = ({ userId, isUserBlocked, isFollowing, isFollowingSent }) => {
  const [userState, setUserState] = useState({
    following: isFollowing,
    blocked: isUserBlocked,
    followingRequestSent: isFollowingSent,
  });

  console.log("following", userState.following);
  console.log("blocked", userState.blocked);
  console.log("followingRequestSent", userState.followingRequestSent);

  const myUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const socket = useSocket(); // Access WebSocket

  const follow = async () => {
    const shouldSendNotification = !userState.following && !userState.followingRequestSent;
    setUserState((prev) => ({
      ...prev,
      following: prev.following && false,
      followingRequestSent: !prev.following && !prev.followingRequestSent ? true : false,
    }));

    try {
      await axios.post(`http://localhost:5050/api/users/${userId}/follow`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserState((prev) => ({
        ...prev,
        following: !prev.following,
        followingRequestSent: false,
      }));

      if (shouldSendNotification) {
        handleClick();
      }
    } catch (err) {
      console.error("Error following user:", err);
    }
  };

  const handleClick = async () => {
    if (socket) {
      const msgData = {
        senderUserId: myUserId,
        receiverUserId: userId,
        title: "sent you a follow request",
        msg: "",
        time: new Date().toISOString(),
      };
      socket.emit("send_notification", msgData);
    }

    await axios.post("http://localhost:6000/api/notifications", {
      title: "sent you a follow request",
      message: "",
      senderId: myUserId,
      receiverId: userId,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const block = async () => {
    setUserState((prev) => ({ ...prev, blocked: !prev.blocked }));

    try {
      await axios.post(`http://localhost:6000/api/users/${userId}/block`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Error blocking user:", err);
    }
  };

  return (
    <>
      <button
        onClick={follow}
        className="w-full bg-blue-500 text-white text-sm rounded-md p-2"
      >
        {userState.following
          ? "Following"
          : userState.followingRequestSent
          ? "Friend Request Sent"
          : "Follow"}
      </button>

      <button onClick={block} className="self-end">
        <span className="text-red-400 text-xs cursor-pointer">
          {userState.blocked ? "Unblock User" : "Block User"}
        </span>
      </button>
    </>
  );
};

export default UserInfoCardInteraction;
