import React, { useState } from "react";
import axios from "axios";
import { useSocket } from "../../context/SocketContext";

const PostInteraction = ({
  postId,
  postUser,
  likes,
  commentNumber,
  bookmarks,
  setOpenComments,
  setAllComments,
}) => {
  const socket = useSocket();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [likeState, setLikeState] = useState({
    likeCount: likes.length,
    isLiked: userId ? likes.includes(userId) : false,
  });

  const toggleComments = async () => {
    setOpenComments((prev) => !prev);
    fetchComments();
  };

  const likeAction = async () => {
    setLikeState((prev) => ({
      likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1,
      isLiked: !prev.isLiked,
    }));

    try {
      await axios.put(
        `http://localhost:5050/api/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!likeState.isLiked && postUser.id !== userId) {
        if (socket) {
          const msgData = {
            senderUserId: userId,
            receiverUserId: postUser.id,
            title: "liked your post",
            msg: "",
            time: new Date().toISOString(),
          };
          socket.emit("send_notification", msgData);
        }

        await axios.post(
          "http://localhost:5050/api/notifications",
          {
            title: "liked your post",
            message: "",
            senderId: userId,
            receiverId: postUser.id,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    if (!postId) return;
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:5050/api/posts/${postId}/comments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAllComments(response.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError("Failed to fetch comments");
    } finally {
      setLoading(false);
    }
  };

  const [isBookmarked, setBookmarked] = useState(
    bookmarks.includes(userId || "")
  );

  const handleBookmark = async () => {
    setBookmarked(!isBookmarked);

    try {
      await axios.post(
        `http://localhost:5050/api/posts/${postId}/bookmark`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error bookmarking post:", err);
    }
  };

  return (
    <div className="flex items-center justify-between text-sm my-4">
      <div className="flex gap-8">
        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
          <button onClick={likeAction}>
            <img
              src={likeState.isLiked ? "/liked.png" : "/like.png"}
              width={16}
              height={16}
              alt="Like"
              className="cursor-pointer"
            />
          </button>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">
            {likeState.likeCount}
            <span className="hidden md:inline cursor-pointer"> Likes</span>
          </span>
        </div>
        <div
          className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl"
          onClick={toggleComments}
        >
          <img
            src="/comment.png"
            width={16}
            height={16}
            alt="Comment"
            className="cursor-pointer"
          />
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">
            {commentNumber}
            <span className="hidden md:inline cursor-pointer"> Comments</span>
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
        <img
          src={isBookmarked ? "/bookBlue.png" : "/book.png"}
          width={16}
          height={16}
          alt="Bookmark"
          className="cursor-pointer"
          onClick={handleBookmark}
        />
        <span className="text-gray-300">|</span>
        <span className="text-gray-500">
          <span className="hidden md:inline cursor-pointer"> Bookmark</span>
        </span>
      </div>
    </div>
  );
};

export default PostInteraction;
