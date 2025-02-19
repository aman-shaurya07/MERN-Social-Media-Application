import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createPost = async (req, res) => {
  try {
    const { userId, desc } = req.body; // ✅ Get userId & desc from request body
    const img = req.file ? `/uploads/${req.file.filename}` : null; // ✅ Store file path as image URL

    if (!userId) {
      return res.status(401).json({ error: "User is not authenticated!" });
    }

    if (!desc || desc.length < 1 || desc.length > 255) {
      return res.status(400).json({ error: "Description is not valid!" });
    }

    const newPost = await prisma.post.create({
      data: {
        userId,
        desc,
        img, // ✅ Save the correct image path
      },
    });

    return res.status(201).json({ message: "Post created successfully!", newPost });
  } catch (err) {
    console.error("Error creating post:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};





// @route  GET /api/posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: { select: { id: true, username: true, avatar: true } },
        comments: { 
          select: { 
            id: true, 
            desc: true, 
            user: { select: { username: true, avatar: true } } 
          } 
        },
        likes: { select: { userId: true } },
        bookmarks: { select: { userId: true } }
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};



export const getPostsBasedOnUser = async (req, res) => {
    try {
      const userId = req.params.id;
      const posts = await prisma.post.findMany({
        where: { userId },
        include: {
          user: { select: { id: true, username: true, avatar: true } },
          comments: { 
            select: { 
              id: true, 
              desc: true, 
              user: { select: { username: true, avatar: true } } 
            } 
          },
          likes: { select: { userId: true } },
          bookmarks: { select: { userId: true } }
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
};




// @route  PUT /api/posts/:id/like
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existingLike = await prisma.like.findFirst({
      where: { postId: id, userId }
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      return res.json({ message: 'Like removed' });
    }

    const like = await prisma.like.create({
      data: { postId: id, userId },
    });

    res.json({ message: 'Post liked', like });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// @route  POST /api/posts/:id/comment
export const commentOnPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { desc } = req.body;
    const userId = req.user.id;

    const comment = await prisma.comment.create({
      data: {
        desc,
        postId: id,
        userId,
      },
    });

    res.json({ message: 'Comment added', comment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// @route  POST /api/posts/:id/bookmark
export const bookmarkPost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existingBookmark = await prisma.bookmark.findFirst({
      where: { postId: id, userId }
    });

    if (existingBookmark) {
      await prisma.bookmark.delete({ where: { id: existingBookmark.id } });
      return res.json({ message: 'Bookmark removed' });
    }

    const bookmark = await prisma.bookmark.create({
      data: { postId: id, userId },
    });

    res.json({ message: 'Post bookmarked', bookmark });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};





export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get IDs of users the logged-in user is following
    const followingIds = await prisma.follower.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    const posts = await prisma.post.findMany({
      where: { userId: { in: followingIds.map(f => f.followingId) } },
      include: {
        user: { select: { id: true, username: true, avatar: true } },
        comments: { select: { id: true, desc: true, user: { select: { username: true, avatar: true } } } },
        likes: { select: { userId: true } },
        bookmarks: { select: { userId: true } }
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(posts);
  } catch (error) {
    console.error("Error fetching following posts:", error);
    res.status(500).json({ message: "Server error", error });
  }
};




export const getProfilePosts = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = await prisma.post.findMany({
      where: { userId: user.id },
      include: {
        user: { select: { id: true, username: true, avatar: true } },
        comments: { select: { id: true, desc: true, user: { select: { username: true, avatar: true } } } },
        likes: { select: { userId: true } },
        bookmarks: { select: { userId: true } }
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(posts);
  } catch (error) {
    console.error("Error fetching profile posts:", error);
    res.status(500).json({ message: "Server error", error });
  }
};






export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find the post
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the logged-in user is the owner of the post
    if (post.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized: Cannot delete this post" });
    }

    // Delete the post
    await prisma.post.delete({ where: { id } });

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Server error", error });
  }
};





export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.id;

    const comment = await prisma.comment.findUnique({ where: { id: commentId } });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized: Cannot delete this comment" });
    }

    await prisma.comment.delete({ where: { id: commentId } });

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Server error", error });
  }
};





export const getPostComments = async (req, res) => {
  try {
    const { id } = req.params;

    const comments = await prisma.comment.findMany({
      where: { postId: id },
      include: {
        user: { select: { username: true, avatar: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

