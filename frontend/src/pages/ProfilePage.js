import React, { useEffect, useState } from "react";
import axios from "axios";
import Feed from "../components/feed/Feed";
import LeftMenu from "../components/leftMenu/LeftMenu";
import RightMenu from "../components/rightMenu/RightMenu";
import BottomMenu from "../components/bottomMenu/BottomMenu";
import UserInfoCard from "../components/rightMenu/UserInfoCard";
import { useParams, useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5050/api/users/profile/${username}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        setUser(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        navigate("/not-found"); // Redirect to 404 page if user not found
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username, navigate]);

  if (loading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  if (!user) {
    return null;
  }

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
                  alt="Cover"
                  className="rounded-lg h-[210px] w-full object-cover"
                />
                <img
                  src={user.avatar || "/noAvatar.png"}
                  alt="Avatar"
                  className="rounded-full h-[110px] w-[110px] object-cover relative top-[-60px]"
                />

                <h1 className="mt-[-60px] text-2xl text-gray-900">
                  {user.name && user.surname ? `${user.name} ${user.surname}` : user.username}
                </h1>

                <div className="flex items-center justify-center gap-6">
                  <div className="flex flex-col items-center">
                    <span className="text-gray-800">{user._count.posts}</span>
                    <span className="text-gray-800">Posts</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-gray-800">{user._count.followers}</span>
                    <span className="text-gray-800">Followers</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-gray-800">{user._count.followings}</span>
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

export default ProfilePage;
