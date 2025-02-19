import React from "react";
import LeftMenu from "../components/leftMenu/LeftMenu";
import RightMenu from "../components/rightMenu/RightMenu";
import BottomMenu from "../components/bottomMenu/BottomMenu";
import Middle from "../components/Middle"; // ✅ Ensure correct import path

const Notifications = () => {
  return (
    <>
      {/* Page Layout */}
      <div className="flex gap-6 pt-6 pb-24">
        {/* Left Sidebar */}
        <div className="hidden lg:block lg:w-[10%] xl:w-[20%]">
          <LeftMenu type="home" />
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-[60%] xl:w-[50%]">
          <div className="flex flex-col gap-4">
            <Middle />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block lg:w-[30%] xl:w-[30%]">
          <RightMenu type="notification" />
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <BottomMenu />
    </>
  );
};

export default Notifications;
