import React from "react";
import Feed from "@/components/feed/Feed";
import LeftMenu from "@/components/leftMenu/LeftMenu";
import RightMenu from "@/components/rightMenu/RightMenu";
import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import BottomMenu from "@/components/bottomMenu/BottomMenu";
import UserInfoCard from "@/components/rightMenu/UserInfoCard";

const profile = async({params}: {params:{username: string}}) => {

  // Fetch user data and posts using the username
  const username = params.username;

  const user = await prisma.user.findFirst({
    where:{username: username},
    include:{
      _count:{
        select:{
          followers: true,
          followings: true,
          posts: true,
        }
      }
    }
  });

  if(!user){return notFound();}
  const {userId: currentUserId} = auth();

  let isBlocked;

  if(currentUserId){
    const res = await prisma.block.findFirst({
      where:{
        blockerId: user.id,
        blockedId: currentUserId,
      },
    });

    if(res){isBlocked = true}
    else{isBlocked = false}
  }

  if(isBlocked){return notFound();}

  return (
    <>
      <div className="flex gap-6 pt-6">
        <div className="hidden lg:block lg:w-[10%] xl:w-[20%]">
          <LeftMenu type="profile" />
        </div>
        <div className="w-full lg:w-[60%] xl:w-[50%]">
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex flex-col p-4 bg-white items-center gap-2">
                <img
                  src={user.cover || "/noCover.png"}
                  alt=""
                  className="rounded-lg h-[210px] w-full object-cover"
                />
                <img
                  src={user.avatar || "/noAvatar.png"}
                  alt=""
                  className="rounded-full h-[110px] w-[110px] object-cover relative top-[-60px]"
                />

                <h1 className="mt-[-60px] text-2xl text-gray-900">
                  {user.name && user.surname
                    ? user.name + " " + user.surname
                    : user.username}
                </h1>

                <div className="flex items-center justify-center gap-6">
                  <div className="flex flex-col items-center">
                    <span className="text-gray-800">{user._count.posts}</span>
                    <span className="text-gray-800">Posts</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-gray-800">
                      {user._count.followers}
                    </span>
                    <span className="text-gray-800">Followers</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-gray-800">
                      {user._count.followings}
                    </span>
                    <span className="text-gray-800">Following</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:hidden">
              <UserInfoCard user={user} />
            </div>

            <Feed username={user.username} />
          </div>
        </div>
        <div className="hidden lg:block lg:w-[30%] xl:w-[30%]">
          <RightMenu user={user} type="profile" />
        </div>
      </div>

      <BottomMenu />
    </>
  );
};

export default profile;
