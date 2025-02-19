import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LeftMenu from "../components/leftMenu/LeftMenu"; // ✅ Fixed import path
import RightMenu from "../components/rightMenu/RightMenu";
import Bookmarks from "../components/Bookmarks";
import BottomMenu from "../components/bottomMenu/BottomMenu";

const BookmarkPage = () => {
  return (
    <>
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

      <div className="flex gap-6 pt-6 pb-24">
        <div className="hidden lg:block lg:w-[10%] xl:w-[20%]">
          <LeftMenu type="home" />
        </div>
        <div className="w-full lg:w-[60%] xl:w-[50%]">
          <div className="flex flex-col gap-6">
            <Bookmarks />
          </div>
        </div>
        <div className="hidden lg:block lg:w-[30%] xl:w-[30%]">
          <RightMenu type="home" />
        </div>
      </div>
      <BottomMenu />
    </>
  );
};

export default BookmarkPage;
