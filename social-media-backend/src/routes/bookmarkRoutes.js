import express from "express";
import { getBookmarks } from "../controllers/bookmarkController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/bookmarks", protect, getBookmarks); // ✅ Fetch all bookmarks for the user

export default router;
