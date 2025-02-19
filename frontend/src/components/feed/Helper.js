import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";

const Helper = ({ comments, postId }) => {
  const token = localStorage.getItem("token");
  const [commentList, setCommentList] = useState(comments);
  const [openDropdown, setOpenDropdown] = useState(null);

  const deleteCommentWithId = async (commentId) => {
    try {
      await axios.delete(`http://localhost:5050/api/posts/${postId}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCommentList(commentList.filter((comment) => comment.id !== commentId));

      toast.success("Comment has been deleted successfully!");
    } catch (err) {
      console.error("Failed to delete comment:", err);
      toast.error("Failed to delete comment. Please try again.");
    }
  };

  return (
    <div>
      <ToastContainer position="bottom-center" autoClose={5000} theme="light" />
      {commentList.map((comment) => (
        <div className="flex gap-4 justify-between mt-6" key={comment.id}>
          <Link to={`/profile/${comment?.user.username}`}>
            <img
              src={comment.user.avatar || "noAvatar.png"}
              alt="User Avatar"
              className="w-6 h-6 rounded-full"
            />
          </Link>

          <div className="flex flex-col flex-1">
            <div className="flex flex-col gap-1">
              <Link to={`/profile/${comment?.user.username}`}>
                <span className="font-medium text-gray-600">
                  {comment.user.name && comment.user.surname
                    ? `${comment.user.name} ${comment.user.surname}`
                    : comment.user.username}
                </span>
              </Link>

              <p className="text-gray-600 whitespace-normal break-words leading-relaxed">
                {comment.desc}
              </p>
            </div>
          </div>

          {/* OPTIONS MENU */}
          <div className="relative">
            <img
              src="/more.png"
              alt="More Options"
              className="cursor-pointer w-4 h-4"
              onClick={() =>
                setOpenDropdown((prev) => (prev === comment.id ? null : comment.id))
              }
            />

            {openDropdown === comment.id && (
              <div className="absolute top-4 right-0 bg-white p-4 w-32 rounded-lg flex flex-col gap-2 text-xs shadow-lg z-30">
                <button
                  onClick={() => deleteCommentWithId(comment.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          <small>
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
            })}
          </small>
        </div>
      ))}
    </div>
  );
};

export default Helper;
