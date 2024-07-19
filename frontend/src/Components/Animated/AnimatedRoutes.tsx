import { Route, Routes, useLocation } from "react-router-dom";
import ProtectedRoutes from "../ProtectedRoutes/ProtectedRoutes";
import Login from "@/Pages/Login/Login";
import { AnimatePresence } from "framer-motion";
import Chats from "@/Pages/Chats/Index";
import ChatBox from "@/Pages/Chats/ChatBox";
import Settings from "@/Pages/Settings";
import Profile from "@/Pages/Profile";
import NearbyPeople from "@/Pages/NearbyPeople/NearbyPeople";

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Login />} />
        <Route
          path="chats"
          element={
            <ProtectedRoutes>
              <Chats />
            </ProtectedRoutes>
          }
        />
        <Route
          path="chats/:participantId"
          element={
            <ProtectedRoutes>
              <ChatBox />
            </ProtectedRoutes>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedRoutes>
              <Settings />
            </ProtectedRoutes>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoutes>
              <Profile />
            </ProtectedRoutes>
          }
        />
        <Route
          path="nearby-people"
          element={
            <ProtectedRoutes>
              <NearbyPeople />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
