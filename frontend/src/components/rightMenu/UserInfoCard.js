import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import UpdateUser from "./UpdateUser";
import UserInfoCardInteraction from "./UserInfoCardInteraction";

const UserInfoCard = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [isUserBlocked, setIsUserBlocked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowingSent, setIsFollowingSent] = useState(false);

  const storedUser = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!storedUser) return;

      try {
        const response = await axios.get(`http://localhost:5050/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    const fetchUserRelations = async () => {
      if (!storedUser) return;

      try {
        const response = await axios.get(`http://localhost:5050/api/users/${userId}/relations`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setIsUserBlocked(response.data.isUserBlocked);
        setIsFollowing(response.data.isFollowing);
        setIsFollowingSent(response.data.isFollowingSent);
      } catch (error) {
        console.error("Error fetching user relations:", error);
      }
    };

    fetchUserProfile();
    fetchUserRelations();
  }, [userId]);

  if (!user) return null;

  const formattedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
      {/* TOP */}
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500">User Information</span>
        {storedUser === user.id ? (
          <UpdateUser user={user} />
        ) : (
          <Link to="/" className="text-blue-500 text-xs">
            See all
          </Link>
        )}
      </div>
      {/* BOTTOM */}
      <div className="flex flex-col gap-4 text-gray-500">
        <div className="flex items-center gap-2">
          <span className="text-xl text-black">
            {user.name && user.surname ? `${user.name} ${user.surname}` : user.username}
          </span>
          <span className="text-sm">@{user.username}</span>
        </div>
        {user.description && <p>{user.description}</p>}
        {user.city && (
          <div className="flex items-center gap-2">
            <img src="/map.png" alt="Location" width={16} height={16} />
            <span>
              Living in <b>{user.city}</b>
            </span>
          </div>
        )}
        {user.school && (
          <div className="flex items-center gap-2">
            <img src="/school.png" alt="School" width={16} height={16} />
            <span>
              Went to <b>{user.school}</b>
            </span>
          </div>
        )}
        {user.work && (
          <div className="flex items-center gap-2">
            <img src="/work.png" alt="Work" width={16} height={16} />
            <span>
              Works at <b>{user.work}</b>
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          {user.website && (
            <div className="flex gap-1 items-center">
              <img src="/link.png" alt="Website" width={16} height={16} />
              <Link to={user.website} className="text-blue-500 font-medium">
                {user.website}
              </Link>
            </div>
          )}
          <div className="flex gap-1 items-center">
            <img src="/date.png" alt="Joined Date" width={16} height={16} />
            <span>Joined {formattedDate}</span>
          </div>
        </div>
        {storedUser !== user.id && (
          <UserInfoCardInteraction
            userId={user.id}
            isUserBlocked={isUserBlocked}
            isFollowing={isFollowing}
            isFollowingSent={isFollowingSent}
          />
        )}
      </div>
    </div>
  );
};

export default UserInfoCard;
