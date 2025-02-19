import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


// @route  GET /api/users/:id
export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: { 
        id: true, 
        username: true, 
        email: true,
        avatar: true,
        cover: true,
        name: true,
        surname: true,
        description: true,
        city: true,
        school: true,
        work: true,
        website: true,
        createdAt: true,
        posts: { select: { id: true, desc: true, img: true, createdAt: true } },
        followers: { select: { followerId: true } },
        followings: { select: { followingId: true } }
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};







export const getUserProfileByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const userId = req.user.id; // ✅ Logged-in user

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const user = await prisma.user.findFirst({
      where: { username },
      include: {
        _count: {
          select: {
            followers: true,
            followings: true,
            posts: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the logged-in user is blocked by the profile owner
    const isBlocked = await prisma.block.findFirst({
      where: {
        blockerId: user.id,
        blockedId: userId,
      },
    });

    if (isBlocked) {
      return res.status(403).json({ error: "Access denied" });
    }

    return res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getFollowingUsers = async (req, res) => {
  try {
    const { id } = req.params;

    const following = await prisma.follower.findMany({
      where: { followerId: id },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    return res.json(following.map((entry) => entry.following));
  } catch (error) {
    console.error("Error fetching following users:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getFollowers = async (req, res) => {
  try {
    const { id } = req.params;

    const followers = await prisma.follower.findMany({
      where: { followingId: id },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    return res.json(followers.map((entry) => entry.follower));
  } catch (error) {
    console.error("Error fetching followers:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};




export const getBookmarkedPosts = async (req, res) => {
  try {
    const { id } = req.params;

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: id },
      include: {
        post: {
          include: {
            user: { select: { id: true, username: true, avatar: true } },
            likes: { select: { userId: true } },
            comments: { select: { userId: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json(bookmarks.map((entry) => entry.post));
  } catch (error) {
    console.error("Error fetching bookmarked posts:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};





// @route  PUT /api/users/:id
export const updateUserProfile = async (req, res) => {
    try {
      const { id } = req.params;
      const { 
        username, 
        avatar, 
        cover, 
        name, 
        surname, 
        description, 
        city, 
        school, 
        work, 
        website 
      } = req.body;
  
      // Ensure user is updating their own profile
      if (req.user.id !== id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
  
      const updatedUser = await prisma.user.update({
        where: { id },
        data: { 
          username, 
          avatar, 
          cover, 
          name, 
          surname, 
          description, 
          city, 
          school, 
          work, 
          website 
        },
        select: { 
          id: true, 
          username: true, 
          email: true,
          avatar: true,
          cover: true,
          name: true,
          surname: true,
          description: true,
          city: true,
          school: true,
          work: true,
          website: true
        },
      });
  
      res.json({ message: 'Profile updated', user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  




  export const getSearchedUsers = async (req, res) => {
    try {
      const { username } = req.params;
      const userId = req.user.id; // ✅ Get authenticated user

      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const searchTerm = username.trim();
      if (!searchTerm) {
        return res.status(400).json({ error: "Search term is empty" });
      }

      // ✅ Perform case-insensitive search
      const users = await prisma.user.findMany({
        where: {
          username: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      });

      return res.json(users);
    } catch (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };



  export const getFriendRequests = async (req, res) => {
    try {
      const userId = req.user.id;
  
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
  
      const requests = await prisma.followRequest.findMany({
        where: { receiverId: userId },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              name: true,
              surname: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
  
      return res.json(requests);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };





  export const acceptFollowRequest = async (req, res) => {
    try {
      const requestId = req.params.id;
      const request = await prisma.followRequest.findUnique({ where: { id: requestId } });
  
      if (!request) {
        return res.status(404).json({ error: "Friend request not found." });
      }
  
      // ✅ Create follower relationship
      await prisma.follower.create({
        data: {
          followerId: request.senderId,
          followingId: request.receiverId,
        },
      });
  
      // ✅ Delete the follow request after acceptance
      await prisma.followRequest.delete({ where: { id: requestId } });
  
      return res.status(200).json({ message: "Follow request accepted." });
    } catch (error) {
      console.error("Error accepting follow request:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  // ✅ Decline Friend Request
  export const declineFollowRequest = async (req, res) => {
    try {
      const requestId = req.params.id;
  
      const request = await prisma.followRequest.findUnique({ where: { id: requestId } });
  
      if (!request) {
        return res.status(404).json({ error: "Friend request not found." });
      }
  
      // ✅ Delete follow request
      await prisma.followRequest.delete({ where: { id: requestId } });
  
      return res.status(200).json({ message: "Follow request declined." });
    } catch (error) {
      console.error("Error declining follow request:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };








// ✅ Search Users by Username
export const searchUsers = async (req, res) => {
  try {
    const { username } = req.query;
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!username || username.trim() === "") {
      return res.json([]); // Return empty array if search is empty
    }

    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: username,
          mode: "insensitive", // Case insensitive search
        },
      },
      select: {
        id: true,
        username: true,
        avatar: true,
      },
    });

    return res.json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
