import { motion } from "framer-motion";
import verifiedSuccess from "../../assets/images/process_success.svg";
import { useAppDispatch } from "../../Hooks/redux";
import Button from "../Button/Button";
import { nextStep } from "./authSlice";
const MobileVerifiedStep = () => {
  const dispatch = useAppDispatch();

  return (
    <motion.div
      initial={{ opacity: 0, x: 120 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -120 }}
      transition={{ duration: 0.3, type: "keyframes" }}
    >
      <img src={verifiedSuccess} alt="" className="w-20 mx-auto my-4" />
      <Button
        variant="primary"
        className="block mx-auto"
        buttonText="continue"
        onClick={() => {
          dispatch(nextStep());
        }}
      />
    </motion.div>
  );
};

export default MobileVerifiedStep;
