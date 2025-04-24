import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Player from "./Player";

const Layout = ({ children }) => {
  return (
    <div className="h-screen bg-[#121212] text-white">
      {/* Main Container */}
      <div className="h-[90%] flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Navbar */}
          <Navbar />

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>

      {/* Player */}
      <div className="h-[10%]">
        <Player />
      </div>
    </div>
  );
};

export default Layout;