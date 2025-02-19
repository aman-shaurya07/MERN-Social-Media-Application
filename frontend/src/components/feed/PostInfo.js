import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PostInfo = ({ postId, setDeletingPostId }) => {
  const token = localStorage.getItem("token");
  const [open, setOpen] = useState(false);

  const deletePostWithId = async () => {
    try {
      await axios.delete(`http://localhost:5050/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Post has been deleted successfully!");
      setDeletingPostId(postId);
    } catch (err) {
      console.error("Failed to delete post:", err);
      toast.error("Failed to delete post. Please try again.");
    }
  };

  return (
    <>
      <ToastContainer position="bottom-center" autoClose={5000} theme="light" />
      <div className="relative">
        <img
          src="/more.png"
          width={16}
          height={16}
          alt="More Options"
          onClick={() => setOpen((prev) => !prev)}
          className="cursor-pointer"
        />
        {open && (
          <div className="absolute top-4 right-0 bg-white p-4 w-32 rounded-lg flex flex-col gap-2 text-xs shadow-lg z-30">
            <button
              onClick={deletePostWithId}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default PostInfo;
