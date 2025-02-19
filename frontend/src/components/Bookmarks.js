import React, { useEffect, useState } from "react";
import axios from "axios";
import Post from "./feed/Post"; // ✅ Fixed import path

const Bookmarks = () => {
  const userId = localStorage.getItem("userId"); // ✅ Get userId from localStorage
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await axios.get("http://localhost:5050/api/bookmarks", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      }
    };

    if (userId) {
      fetchBookmarks();
    }
  }, [userId]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-around p-2 bg-white p-4 rounded-lg">
        <h1 className="text-3xl text-gray-700">Bookmarked Posts</h1>
      </div>

      <div className="flex flex-col">
        <div className="flex flex-col gap-6">
          {posts.length ? (
            posts.map((bookmark) => <Post key={bookmark.id} post={bookmark.post} />)
          ) : (
            "No posts found!"
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;
