import React, { useEffect, useState } from "react";
import axios from "axios";
import Helper from "./Helper";
import { useSocket } from "../../context/SocketContext";

const CommentList = ({ comments, postId, postUser }) => {
  const socket = useSocket();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [commentState, setCommentState] = useState([]);
  const [desc, setDesc] = useState("");

  useEffect(() => {
    setCommentState(comments);
  }, [comments]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5050/api/posts/${postId}/comments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentState(response.data);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    if (!userId || !desc) return;

    // Optimistic UI: Temporarily add the comment before API response
    const optimisticComment = {
      id: `${Math.random()}`,
      desc,
      createdAt: new Date(),
      user: {
        id: userId,
        username: "Sending...",
        avatar: "/noAvatar.png",
        name: "You",
        surname: "",
      },
    };

    setCommentState((prev) => [optimisticComment, ...prev]);

    try {
      const response = await axios.post(
        "http://localhost:5050/api/comments",
        { postId, desc },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const createdComment = response.data;

      // Replace the optimistic comment with the actual one
      setCommentState((prev) =>
        prev.map((comment) =>
          comment.id === optimisticComment.id ? createdComment : comment
        )
      );

      await fetchComments();

      // Emit a socket notification if the comment is not from the post owner
      if (postUser.id !== userId) {
        const commentNotificationData = {
          senderUserId: userId,
          receiverUserId: postUser.id,
          title: "commented on your post",
          msg: desc,
          time: new Date().toISOString(),
        };
        socket?.emit("send_notification", commentNotificationData);

        await axios.post(
          "http://localhost:5050/api/notifications",
          {
            title: "commented on your post",
            message: desc,
            senderId: userId,
            receiverId: postUser.id,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  return (
    <>
      {userId && (
        <div className="flex items-center gap-4">
          <img
            src={"/noAvatar.png"}
            alt="User Avatar"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
          />
          <form
            onSubmit={addComment}
            className="flex-1 flex items-center justify-between bg-slate-100 rounded-xl text-sm px-6 py-2 w-full"
          >
            <input
              type="text"
              placeholder="Write a comment..."
              className="bg-transparent outline-none flex-1"
              onChange={(e) => setDesc(e.target.value)}
            />
            <button type="submit">
              <img src="/emoji.png" alt="Emoji" width={16} height={16} />
            </button>
          </form>
        </div>
      )}

      <Helper comments={commentState} postId={postId} />
    </>
  );
};

export default CommentList;
