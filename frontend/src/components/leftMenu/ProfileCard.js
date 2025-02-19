import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ProfileCard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const storedUserId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      if (!storedUserId) return;

      try {
        console.log("I am inside Profile Card");
        const response = await axios.get(`http://localhost:5050/api/users/${storedUserId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  if (!user) return null;

  return (
    <div className="hidden xl:block">
      <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-6">
        <div className="h-20 relative">
          <img
            src={user.cover || "/noCover.png"}
            alt="Cover"
            className="rounded-md object-cover h-20 w-full"
          />
          <img
            src={user.avatar || "/noAvatar.png"}
            alt="Avatar"
            className="rounded-full object-cover w-12 h-12 absolute left-0 right-0 m-auto -bottom-6 ring-1 ring-white z-10"
          />
        </div>
        <div className="h-20 flex flex-col gap-2 items-center">
          <span className="font-semibold">
            {user.name && user.surname ? `${user.name} ${user.surname}` : user.username}
          </span>
          <div className="flex items-center gap-4">
            <div className="flex">
              {[...Array(3)].map((_, i) => (
                <img
                  key={i}
                  src="https://images.pexels.com/photos/19578755/pexels-photo-19578755/free-photo-of-woman-watching-birds-and-landscape.jpeg"
                  alt="Follower"
                  className="rounded-full object-cover w-3 h-3"
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">{user.followers.length} Followers</span>
          </div>
          <Link to={`/profile/${user.username}`}>
            <button className="bg-blue-500 text-white text-xs p-2 rounded-md">My Profile</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;













// import prisma from "@/lib/client";
// import { auth } from "@clerk/nextjs/server";
// import Link from "next/link";

// const ProfileCard = async () => {
//   const { userId } = auth();

//   if (!userId) return null;

//   const user = await prisma.user.findFirst({
//     where: {
//       id: userId,
//     },
//     include: {
//       _count: {
//         select: {
//           followers: true,
//         },
//       },
//     },
//   });

//   if (!user) return null;

//   return (
//     <div className="hidden xl:block">
//       <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-6">
//         <div className="h-20 relative">
//           <img
//             src={user.cover || "/noCover.png"}
//             alt=""
//             className="rounded-md object-cover h-20 w-full"
//             />
//           <img
//             src={user.avatar || "/noAvatar.png"}
//             alt=""
//             width={48}
//             height={48}
//             className="rounded-full object-cover w-12 h-12 absolute left-0 right-0 m-auto -bottom-6 ring-1 ring-white z-10"
//             />
//         </div>
//         <div className="h-20 flex flex-col gap-2 items-center">
//           <span className="font-semibold">
//             {user.name && user.surname
//               ? user.name + " " + user.surname
//               : user.username}
//           </span>
//           <div className="flex items-center gap-4">
//             <div className="flex">
//               <img
//                 src="https://images.pexels.com/photos/19578755/pexels-photo-19578755/free-photo-of-woman-watching-birds-and-landscape.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
//                 alt=""
//                 width={12}
//                 height={12}
//                 className="rounded-full object-cover w-3 h-3"
//               />
//               <img
//                 src="https://images.pexels.com/photos/19578755/pexels-photo-19578755/free-photo-of-woman-watching-birds-and-landscape.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
//                 alt=""
//                 width={12}
//                 height={12}
//                 className="rounded-full object-cover w-3 h-3"
//               />
//               <img
//                 src="https://images.pexels.com/photos/19578755/pexels-photo-19578755/free-photo-of-woman-watching-birds-and-landscape.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
//                 alt=""
//                 width={12}
//                 height={12}
//                 className="rounded-full object-cover w-3 h-3"
//               />
//             </div>
//             <span className="text-xs text-gray-500">
//               {user._count.followers} Followers
//             </span>
//           </div>
//           <Link href={`/profile/${user.username}`}>
//             <button className="bg-blue-500 text-white text-xs p-2 rounded-md">
//               My Profile
//             </button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileCard;
