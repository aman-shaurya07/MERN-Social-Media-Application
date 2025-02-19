import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AddPost from "../components/AddPost";
// import Stories from "../components/Stories";
import Feed from "../components/feed/Feed";
import RightMenu from "../components/rightMenu/RightMenu";
import BottomMenu from "../components/bottomMenu/BottomMenu";
import LeftMenu from "../components/leftMenu/LeftMenu";

const Homepage = () => {
  return (
    <>
      {/* Toast Notifications */}
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnHover
        draggable
        pauseOnFocusLoss
        theme="light"
      />

      {/* Page Layout */}
      <div className="flex gap-6 pt-6 pb-24">
        {/* Left Sidebar */}
        <div className="hidden lg:block lg:w-[10%] xl:w-[20%]">
          <LeftMenu type="home" />
          {/* Left Menu */}
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-[60%] xl:w-[50%]">
          <div className="flex flex-col gap-6">
            {/* <Stories /> */}
            <AddPost />
            <Feed />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block lg:w-[30%] xl:w-[30%]">
          <RightMenu type="home" />
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <BottomMenu />
    </>
  );
};

export default Homepage;
