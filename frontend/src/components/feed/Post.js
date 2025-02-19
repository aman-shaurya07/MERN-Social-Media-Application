import React, { useState } from "react";
import { Link } from "react-router-dom";
import PostInteraction from "./PostInteraction";
import PostInfo from "./PostInfo";
import CommentList from "./CommentList";

const Post = ({ post, setDeletingPostId }) => {
  const userId = localStorage.getItem("userId");
  const [openComments, setOpenComments] = useState(false);
  const [allComments, setAllComments] = useState([]);

  return (
    <div className="flex bg-white flex-col gap-3 p-4 shadow-md rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex gap-3 items-center">
          <img
            src={post.user.avatar || "/noAvatar.png"}
            className="h-8 w-8 rounded-full cursor-pointer"
            alt="User Avatar"
          />
          <Link to={`/profile/${post.user.username}`}>
            <span className="text-[20px] text-gray-600 cursor-pointer">
              {post.user.name && post.user.surname
                ? `${post.user.name} ${post.user.surname}`
                : post.user.username}
            </span>
          </Link>
        </div>

        {userId === post.user.id && (
          <PostInfo postId={post.id} setDeletingPostId={setDeletingPostId} />
        )}
      </div>

      <div className="flex flex-col gap-4">
        {post.img && (
          <div className="w-full min-h-96 relative">
            <img
              src={post.img}
              className="object-cover rounded-md w-full h-[500px]"
              alt="Post"
            />
          </div>
        )}
        <p className="text-gray-600">{post.desc}</p>
      </div>

      {/* Interaction */}
      <PostInteraction
        postId={post.id}
        postUser={post.user}
        likes={post.likes.map((like) => like.userId)}
        commentNumber={post.comments.length}
        bookmarks={post.bookmarks.map((temp) => temp.userId)}
        setOpenComments={setOpenComments}
        setAllComments={setAllComments}
      />

      {openComments && (
        <CommentList comments={allComments} postId={post.id} postUser={post.user} />
      )}
    </div>
  );
};

export default Post;
