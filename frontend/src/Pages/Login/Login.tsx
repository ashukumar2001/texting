import { useEffect, useState } from "react";
import { MdKeyboardArrowUp } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import chattingIllustration from "../../assets/images/chatting.svg";
import Button from "../../Components/Button/Button";
import styles from "./Login.module.scss";
import { authSteps } from "../../utils/constants";
import { useAppSelector } from "../../Hooks/redux";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "../../Components/Animated/AnimatedPage";
import SignInStep from "../../Components/AuthSteps/SignInStep";
const Home = () => {
  const [isDrawerExtended, setIsDrawerExtended] = useState<boolean>(false);
  const { currentPageStep, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.isUserAuthenticated) {
      navigate("/chats", { replace: true });
    }
  }, [user.isUserAuthenticated]);

  return (
    <AnimatedPage isInitial={false} className="relative h-screen w-full">
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
          }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="max-w-xs w-3/4 mx-auto"
        >
          <img
            src={chattingIllustration}
            alt="app-image"
            className="w-full mt-24 mb-4 inline"
          />
        </motion.div>
        <motion.p
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-gray-600 text-center text-2xl font-medium mb-2"
        >
          texting
        </motion.p>
        <motion.p
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="text-gray-400 text-center text-md"
        >
          a simple real-time chat application
        </motion.p>
        <div
          className={`w-full rounded-t-3xl absolute bottom-0 left-0 shadow-drawer transition-all duration-300 bg-gray-100 z-10 flex-col justify-center items-center ${
            styles.bottomDrawer
          } ${isDrawerExtended ? styles.bottomDrawerExtended : ""}`}
        >
          {/* {(currentPageStep === 0 !) && ( */}
          <Button
            onClick={() => {
              setIsDrawerExtended(!isDrawerExtended);
            }}
            variant="icon"
            className="absolute inset-x-1/2 -translate-x-1/2 -translate-y-1/2 top-0 grid place-items-center"
            icon={
              <MdKeyboardArrowUp
                className={`text-gray-100 text-3xl transition-all duration-300 ${
                  isDrawerExtended ? styles.drawerArrowDown : ""
                }`}
              />
            }
          />
          <div>
            <motion.p
              initial={{ opacity: 0, width: "fit-content" }}
              animate={{ opacity: 1, width: "fit-content" }}
              className={`text-gray-600 text-center text-base font-bold -mt-2  transition-all duration-300 mx-auto ${
                !isDrawerExtended ? "animate-bounce" : ""
              }`}
            >
              {!isDrawerExtended
                ? "start now"
                : authSteps[currentPageStep].title}
            </motion.p>
            <AnimatePresence>
              {isDrawerExtended && currentPageStep === 0 && <SignInStep />}
            </AnimatePresence>
          </div>
        </div>
      </>
    </AnimatedPage>
  );
};

export default Home;
