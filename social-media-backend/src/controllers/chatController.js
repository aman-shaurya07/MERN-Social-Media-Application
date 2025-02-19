import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Fetch all chats for the logged-in user
export const getChats = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const chats = await prisma.chat.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: {
        user1: { select: { id: true, username: true, avatar: true, name: true, surname: true } },
        user2: { select: { id: true, username: true, avatar: true, name: true, surname: true } },
        messages: { orderBy: { createdAt: "asc" } },
      },
    });

    return res.json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Fetch a single chat by chat ID
export const getChat = async (req, res) => {
  try {
    const chatId = req.params.id;

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        user1: { select: { id: true, username: true, avatar: true, name: true, surname: true } },
        user2: { select: { id: true, username: true, avatar: true, name: true, surname: true } },
        messages: { orderBy: { createdAt: "asc" } },
      },
    });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found." });
    }

    return res.json(chat);
  } catch (error) {
    console.error("Error fetching chat:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};









// ✅ Create a chat between two users
export const createChat = async (req, res) => {
  try {
    const { userId } = req.params;
    const myUserId = req.user.id;

    if (!myUserId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (userId === myUserId) {
      return res.status(400).json({ error: "Cannot create a chat with yourself" });
    }

    // Check if chat already exists
    const existingChat = await prisma.chat.findFirst({
      where: {
        OR: [
          { user1Id: myUserId, user2Id: userId },
          { user1Id: userId, user2Id: myUserId },
        ],
      },
    });

    if (existingChat) {
      return res.json(existingChat); // ✅ Return existing chat
    }

    // Create a new chat if none exists
    const newChat = await prisma.chat.create({
      data: {
        user1Id: myUserId,
        user2Id: userId,
        lastMessage: "",
      },
    });

    return res.status(201).json(newChat);
  } catch (error) {
    console.error("Error creating chat:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};








// ✅ Send a new message
export const sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;
    const senderId = req.user.id;

    if (!chatId || !content) {
      return res.status(400).json({ error: "Invalid message data" });
    }

    const newMessage = await prisma.message.create({
      data: {
        chatId,
        senderId,
        content,
      },
    });

    return res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
