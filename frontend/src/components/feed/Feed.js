import React, { useEffect, useState } from "react";
import axios from "axios";
import Post from "./Post";

const Feed = ({ username }) => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [allPosts, setAllPosts] = useState([]);
  const [followingPosts, setFollowingPosts] = useState([]);
  const [profilePosts, setProfilePosts] = useState([]);
  const [deletingPostId, setDeletingPostId] = useState(null);
  const [myFlag, setMyFlag] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (username) {
          const profileResponse = await axios.get(
            `http://localhost:5050/api/posts/profile/${username}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setProfilePosts(profileResponse.data);
        } else if (userId) {
          const followingResponse = await axios.get(  
            `http://localhost:5050/api/posts/following`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setFollowingPosts(followingResponse.data);
        }

        const allPostsResponse = await axios.get(
          `http://localhost:5050/api/posts/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAllPosts(allPostsResponse.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [username, userId]);

  useEffect(() => {
    if (deletingPostId) {
      setAllPosts((prev) => prev.filter((post) => post.id !== deletingPostId));
      setProfilePosts((prev) => prev.filter((post) => post.id !== deletingPostId));
      setFollowingPosts((prev) => prev.filter((post) => post.id !== deletingPostId));
    }
  }, [deletingPostId]);

  return (
    <>
      {username ? (
        <div className="flex flex-col gap-6">
          {profilePosts.length ? (
            profilePosts.map((post, index) => (
              <Post post={post} setDeletingPostId={setDeletingPostId} key={post.id || index} />
            ))
          ) : (
            "No posts found!"
          )}
        </div>
      ) : (
        <div className="flex flex-col ">
          <div className="flex rounded-lg bg-white mb-4 border-spacing-2">
            <div
              className={`flex-1 p-4 border-2 text-center cursor-pointer ${!myFlag ? "border-2" : "border-none"}`}
              onClick={() => setMyFlag(false)}
            >
              For You
            </div>
            <div
              className={`flex-1 p-4 border-2 text-center cursor-pointer ${myFlag ? "border-2" : "border-none"}`}
              onClick={() => setMyFlag(true)}
            >
              Following Posts
            </div>
          </div>

          {myFlag === false ? (
            <div className="flex flex-col gap-6">
              {allPosts.length ? (
                allPosts.map((post, index) => (
                  <Post post={post} setDeletingPostId={setDeletingPostId} key={post.id || index} />
                ))
              ) : (
                "No posts found!"
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {followingPosts.length ? (
                followingPosts.map((post, index) => (
                  <Post post={post} setDeletingPostId={setDeletingPostId} key={post.id || index} />
                ))
              ) : (
                "No posts found!"
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Feed;
