import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Fetch Notifications for the Logged-in User
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const notifications = await prisma.notification.findMany({
      where: { receiverId: userId },
      include: {
        sender: { select: { id: true, username: true, name: true, surname: true, avatar: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Create a New Notification
export const createNotification = async (req, res) => {
  try {
    const { title, message, senderId, receiverId } = req.body;

    if (!title || !message || !senderId || !receiverId) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newNotification = await prisma.notification.create({
      data: {
        title,
        message,
        senderId,
        receiverId,
        unread: true,
      },
    });

    return res.status(201).json(newNotification);
  } catch (error) {
    console.error("Error creating notification:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Mark Notification as Read
export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: { unread: false },
    });

    return res.json(updatedNotification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
