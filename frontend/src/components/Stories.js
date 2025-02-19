import React, { useEffect, useState } from "react";
import StoryList from "./StoryList";
import axios from "axios";

const Stories = () => {
  const [stories, setStories] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")); // Get user from localStorage

  useEffect(() => {
    const fetchStories = async () => {
      if (!user) return;

      try {
        const response = await axios.get("http://localhost:6000/api/stories", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setStories(response.data);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };

    fetchStories();
  }, [user]);

  if (!user) return null;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md overflow-scroll text-xs scrollbar-hide">
      <div className="flex gap-8 w-max">
        <StoryList stories={stories} userId={user.id} />
      </div>
    </div>
  );
};

export default Stories;











// import prisma from "@/lib/client";
// import { auth } from "@clerk/nextjs/server";
// import StoryList from "./StoryList";

// const Stories = async () => {
//   const { userId: currentUserId } = auth();

//   if (!currentUserId) return null;

//   const stories = await prisma.story.findMany({
//     where: {
//       expiresAt: {
//         gt: new Date(),
//       },
//       OR: [
//         {
//           user: {
//             followers: {
//               some: {
//                 followerId: currentUserId,
//               },
//             },
//           },
//         },
//         {
//           userId: currentUserId,
//         },
//       ],
//     },
//     include: {
//       user: true,
//     },
//   });
//   return (
//     <div className="p-4 bg-white rounded-lg shadow-md overflow-scroll text-xs scrollbar-hide">
//       <div className="flex gap-8 w-max">
//         <StoryList stories={stories} userId={currentUserId} />
//       </div>
//     </div>
//   );
// };

// export default Stories;
