import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Fetch all bookmarks for the logged-in user
export const getBookmarks = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      include: {
        post: {
          include: {
            user: { select: { id: true, username: true, avatar: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json(bookmarks);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
