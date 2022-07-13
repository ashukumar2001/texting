import { motion } from "framer-motion";
import { RefObject, useEffect, useRef } from "react";
import Button from "../Button/Button";
import Input from "../Input/Input";

const OtpStep = () => {
  const otpInputRef: RefObject<HTMLInputElement> = useRef(null);

  useEffect(() => {
    if (otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, x: 120 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -120 }}
      transition={{ duration: 0.3, type: "keyframes" }}
    >
      <Input
        type="text"
        className="text-center"
        placeholder="otp here"
        inputRef={otpInputRef}
        // value={mobileNumber}
        // onChange={(e) => {
        //   setMobileNumber(e.target.value);
        // }}
        max={4}
        maxLength={4}
      />
      <Button
        variant="primary"
        className="block mx-auto"
        buttonText="verify"
        // onClick={() => setCurrentStep(currentStep + 1)}
      />
    </motion.div>
  );
};

export default OtpStep;
