import React from "react";
import Navbar from "./Navbar";

const RootLayout = ({ children }) => {
  return (
    <div className="relative z-0">
      <div className="w-full bg-white px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <Navbar />
      </div>
      <div className="bg-slate-100 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 h-screen">
        {children}
      </div>
    </div>
  );
};

export default RootLayout;
