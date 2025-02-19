import express from "express";
import { getNotifications, createNotification, markNotificationAsRead } from "../controllers/notificationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/getNotifications", protect, getNotifications); // ✅ Fetch notifications
router.post("/createNotification", protect, createNotification); // ✅ Create notification
router.put("/markAsRead/:id", protect, markNotificationAsRead); // ✅ Mark notification as read

export default router;
