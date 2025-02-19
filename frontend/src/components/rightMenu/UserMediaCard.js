import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const UserMediaCard = ({ userId }) => {
  const [postsWithMedia, setPostsWithMedia] = useState([]);

  useEffect(() => {
    const fetchUserMedia = async () => {
      try {
        const response = await axios.get(`http://localhost:5050/api/users/${userId}/media`);
        setPostsWithMedia(response.data);
      } catch (error) {
        console.error("Error fetching user media:", error);
      }
    };

    fetchUserMedia();
  }, [userId]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
      {/* TOP */}
      <div className="flex justify-between items-center font-medium">
        <span className="text-gray-500">User Media</span>
        <Link to="/" className="text-blue-500 text-xs">
          See all
        </Link>
      </div>
      {/* BOTTOM */}
      <div className="flex gap-4 justify-between flex-wrap">
        {postsWithMedia.length ? (
          postsWithMedia.map((post) => (
            <div className="relative w-[30%] h-24" key={post.id}>
              <img
                src={post.img}
                alt="Post"
                className="object-cover rounded-md w-full h-full"
              />
            </div>
          ))
        ) : (
          <span>No media found!</span>
        )}
      </div>
    </div>
  );
};

export default UserMediaCard;
