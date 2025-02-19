import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Search from "./pages/Search";
import ChatPage from "./pages/ChatPage";
import BookmarkPage from "./pages/BookmarkPage";
import ProfilePage from "./pages/ProfilePage";

import Notifications from "./pages/Notifications";
// import Profile from "./pages/Profile";

import { SocketProvider } from "./context/SocketContext";


// import UploadImage from "./components/UploadImage";

function App() {
  return (
  <SocketProvider>
    <Router>
      <Routes>
        {/* Login & Signup should NOT use RootLayout */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard uses SpecialLayout */}
        {/* <Route path="/dashboard" element={<SpecialLayout><Dashboard /></SpecialLayout>} /> */}

        {/* All other pages use RootLayout */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/search" element={<Layout><Search /></Layout>} />
        <Route path="/notifications" element={<Layout><Notifications /></Layout>} />
        <Route path="/messages" element={<Layout><ChatPage /></Layout>} />
        <Route path="/bookmark" element={<Layout><BookmarkPage /></Layout>} />
        <Route path="/profile/:username" element={<Layout><ProfilePage/></Layout>} />

      </Routes>
    </Router>
  </SocketProvider>
  );
}

export default App;
