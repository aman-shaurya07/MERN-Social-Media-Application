import express from 'express';
import { getUserProfile, updateUserProfile, getSearchedUsers, getFriendRequests, acceptFollowRequest, declineFollowRequest, searchUsers, getUserProfileByUsername, getFollowingUsers, getFollowers, getBookmarkedPosts } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// router.get('/me', protect, getCurrentUser);
router.get('/:id', getUserProfile); // Get user details

router.get("/profile/:username", protect, getUserProfileByUsername);

router.put('/:id', protect, updateUserProfile); // Update user profile (only if logged in)

router.get("/following/:id", protect, getFollowingUsers);

router.get("/followers/:id", protect, getFollowers);

router.get("/bookmarks/:id", protect, getBookmarkedPosts);


router.get("/search/:username", protect, getSearchedUsers); // ✅ Define API route

router.get("/followRequests", protect, getFriendRequests); // ✅ Fetch friend requests

router.post("/followRequests/accept/:id", protect, acceptFollowRequest); // ✅ Accept friend request
router.post("/followRequests/decline/:id", protect, declineFollowRequest);


router.get("/searchUsers", protect, searchUsers); // ✅ Search for users





// Get user relations (block status, follow status, request status)
router.get("/:id/relations", protect, async (req, res) => {
    try {
      const { id } = req.params;
      const currentUserId = req.user.id;
  
      if (!currentUserId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      // Check if user is blocked
      const blockRes = await prisma.block.findFirst({
        where: { blockerId: currentUserId, blockedId: id },
      });
  
      const followRes = await prisma.follower.findFirst({
        where: { followerId: currentUserId, followingId: id },
      });
  
      const followReqRes = await prisma.followRequest.findFirst({
        where: { senderId: currentUserId, receiverId: id },
      });
  
      res.json({
        isUserBlocked: !!blockRes,
        isFollowing: !!followRes,
        isFollowingSent: !!followReqRes,
      });
    } catch (error) {
      console.error("Error fetching user relations:", error);
      res.status(500).json({ message: "Server error", error });
    }
  });





  // Follow a user (send request or accept follow)
router.post("/:id/follow", protect, async (req, res) => {
    try {
      const { id } = req.params;
      const currentUserId = req.user.id;
  
      if (currentUserId === id) {
        return res.status(400).json({ message: "You cannot follow yourself" });
      }
  
      // Check if user is already following
      const existingFollow = await prisma.follower.findFirst({
        where: { followerId: currentUserId, followingId: id },
      });
  
      if (existingFollow) {
        await prisma.follower.delete({ where: { id: existingFollow.id } });
        return res.json({ message: "Unfollowed user" });
      }
  
      await prisma.follower.create({
        data: { followerId: currentUserId, followingId: id },
      });
  
      res.json({ message: "Followed user" });
    } catch (error) {
      console.error("Error following user:", error);
      res.status(500).json({ message: "Server error", error });
    }
  });
  
  // Block a user
  router.post("/:id/block", protect, async (req, res) => {
    try {
      const { id } = req.params;
      const currentUserId = req.user.id;
  
      if (currentUserId === id) {
        return res.status(400).json({ message: "You cannot block yourself" });
      }
  
      const existingBlock = await prisma.block.findFirst({
        where: { blockerId: currentUserId, blockedId: id },
      });
  
      if (existingBlock) {
        await prisma.block.delete({ where: { id: existingBlock.id } });
        return res.json({ message: "Unblocked user" });
      }
  
      await prisma.block.create({
        data: { blockerId: currentUserId, blockedId: id },
      });
  
      res.json({ message: "Blocked user" });
    } catch (error) {
      console.error("Error blocking user:", error);
      res.status(500).json({ message: "Server error", error });
    }
  });





  // Get user media (posts with images)
router.get("/:id/media", async (req, res) => {
    try {
      const { id } = req.params;
  
      const postsWithMedia = await prisma.post.findMany({
        where: {
          userId: id,
          img: { not: null },
        },
        take: 8,
        orderBy: { createdAt: "desc" },
      });
  
      res.json(postsWithMedia);
    } catch (error) {
      console.error("Error fetching user media:", error);
      res.status(500).json({ message: "Server error", error });
    }
  });
  
  



  // Get friend requests
router.get("/friend-requests", protect, async (req, res) => {
    try {
      const userId = req.user.id;
  
      const requests = await prisma.followRequest.findMany({
        where: { receiverId: userId },
        include: { sender: true },
      });
  
      res.json(requests);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      res.status(500).json({ message: "Server error", error });
    }
  });

  



  // Get users who have birthdays today
router.get("/birthdays", async (req, res) => {
    try {
      const today = new Date().toISOString().slice(5, 10); // Get MM-DD format
  
      const birthdays = await prisma.user.findMany({
        where: {
          birthday: { contains: today }, // Matches MM-DD format in stored birthdays
        },
        select: { id: true, username: true, avatar: true },
      });
  
      res.json(birthdays);
    } catch (error) {
      console.error("Error fetching birthdays:", error);
      res.status(500).json({ message: "Server error", error });
    }
  });

  




  import multer from "multer";

// Configure Multer for File Uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Update user profile
router.put("/:id", upload.single("cover"), protect, async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id;

    if (currentUserId !== id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { name, surname, description, city, school, work, website } = req.body;
    const updatedData = { name, surname, description, city, school, work, website };

    // If cover image is uploaded, convert it to base64 and save (or upload to Cloudinary in future)
    if (req.file) {
      updatedData.cover = `data:image/png;base64,${req.file.buffer.toString("base64")}`;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updatedData,
    });

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Server error", error });
  }
});






// Accept friend request
router.post("/:id/accept", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id;

    // Remove request from followRequest table
    await prisma.followRequest.deleteMany({
      where: { senderId: id, receiverId: currentUserId },
    });

    // Add follow entry
    await prisma.follower.create({
      data: { followerId: id, followingId: currentUserId },
    });

    res.json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Decline friend request
router.post("/:id/decline", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id;

    await prisma.followRequest.deleteMany({
      where: { senderId: id, receiverId: currentUserId },
    });

    res.json({ message: "Friend request declined" });
  } catch (error) {
    console.error("Error declining friend request:", error);
    res.status(500).json({ message: "Server error", error });
  }
});








// // Get user profile
// router.get("/:id", protect, async (req, res) => {
//   try {
//     const { id } = req.params;

//     const user = await prisma.user.findUnique({
//       where: { id },
//       select: { id: true, username: true, avatar: true },
//     });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json(user);
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// });




  


export default router;
