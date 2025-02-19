

import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostsBasedOnUser,
  getFollowingPosts,
  getProfilePosts,
  likePost,
  commentOnPost,
  bookmarkPost,
  deletePost,
  deleteComment,
  getPostComments
} from '../controllers/postController.js';

import { protect } from "../middlewares/authMiddleware.js";
import multer from "multer";

// ✅ Configure Multer to Store Files in `uploads/`
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // ✅ Save images in `uploads/` folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // ✅ Unique filename
  },
});

const upload = multer({ storage: storage });


const router = express.Router();

router.post("/", protect, upload.single("image"), createPost); // ✅ Handle file upload
router.get('/', getAllPosts); // Get all posts
router.get('/:id', getPostsBasedOnUser); // Get posts based on userId
router.get('/following', protect, getFollowingPosts); // ✅ Get posts from followed users
router.get('/profile/:username', getProfilePosts); // ✅ Get posts for a specific profile
router.put('/:id/like', protect, likePost); // Like a post
router.post('/:id/comment', protect, commentOnPost); // Comment on a post
router.post('/:id/bookmark', protect, bookmarkPost); // Bookmark a post
router.get("/:id/comments", getPostComments);
router.delete('/:id', protect, deletePost); // ✅ Delete a post
router.delete('/:postId/comments/:commentId', protect, deleteComment); // ✅ Fix: Separate delete comment route

export default router;
