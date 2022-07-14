import { useState } from "react";
import Button from "../Button/Button";
import Input from "../Input/Input";
import { motion } from "framer-motion";
import { authenticateRequest } from "./authSlice";
import { useAppDispatch } from "../../hooks/redux";
import { mobileValidationRegEx } from "../../utils/constants";

const MobileNumberStep = () => {
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const dispatch = useAppDispatch();
  return (
    <motion.div
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -120 }}
      transition={{ duration: 0.3, type: "keyframes" }}
    >
      <Input
        type="tel"
        className="text-center"
        placeholder="your number here"
        value={mobileNumber}
        onChange={(e) => {
          const value = e.target.value;
          if (value === "" || /^\d+$/.test(value)) {
            setMobileNumber(value);
          }
        }}
        maxLength={10}
      />
      <Button
        variant="primary"
        disabled={!mobileValidationRegEx.test(mobileNumber)}
        className="block mx-auto"
        buttonText="get otp"
        onClick={() => {
          dispatch(authenticateRequest({ mobileNumber }));
          setMobileNumber("");
        }}
      />
    </motion.div>
  );
};

export default MobileNumberStep;
