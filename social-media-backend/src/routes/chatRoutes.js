import express from "express";
import { getChats, getChat, createChat, sendMessage } from "../controllers/chatController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/getChats", protect, getChats); // ✅ Fetch all chats for the user
router.get("/getChat/:id", protect, getChat); // ✅ Fetch a single chat by ID
router.post("/createChat/:userId", protect, createChat); // ✅ Create a chat with another user
router.post("/messages", protect, sendMessage); // ✅ Send a new message



export default router;
