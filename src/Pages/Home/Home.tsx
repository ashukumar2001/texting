import { useState } from "react";
import { MdKeyboardArrowUp } from "react-icons/md";
import { motion } from "framer-motion";
import chattingIllustration from "../../assets/images/chatting.svg";
import Button from "../../Components/Button/Button";
import styles from "./Home.module.scss";
import Input from "../../Components/Input/Input";
const Home = () => {
  const [isDrawerExtended, setIsDrawerExtended] = useState<boolean>(false);
  const [mobileNumber, setMobileNumber] = useState<string>("");

  return (
    <div className="relative h-screen w-full">
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
        className="text-gray-500 text-center text-2xl font-medium mb-2"
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
        className={`w-full rounded-t-3xl absolute bottom-0 left-0 shadow-drawer transition-all duration-300 bg-gray-100 z-10 ${
          styles.bottomDrawer
        } ${isDrawerExtended ? styles.bottomDrawerExtended : ""}`}
      >
        <Button
          onClick={() => setIsDrawerExtended(!isDrawerExtended)}
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
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-gray-500 text-center text-base font-bold -mt-2  transition-all duration-300 ${
            !isDrawerExtended ? "animate-bounce" : ""
          }`}
        >
          {!isDrawerExtended ? "start now" : "continue with your phone"}
        </motion.p>
        {isDrawerExtended && (
          <>
            <Input
              type="tel"
              className="text-center"
              placeholder="your number here"
              value={mobileNumber}
              onChange={(e) => {
                setMobileNumber(e.target.value);
              }}
            />
            <Button
              variant="primary"
              className="block mx-auto"
              buttonText="get opt"
              onClick={() => {}}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
