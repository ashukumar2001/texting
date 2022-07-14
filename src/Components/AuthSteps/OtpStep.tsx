import { motion } from "framer-motion";
import { RefObject, useEffect, useRef, useState } from "react";
import { otpValidationRegEx } from "../../utils/constants";
import Button from "../Button/Button";
import Input from "../Input/Input";

const OtpStep = () => {
  const [otp, setOtp] = useState<string>("");
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
        value={otp}
        onChange={(e) => {
          const value = e.target.value;
          if (value === "" || /^\d+$/.test(value)) {
            setOtp(value);
          }
        }}
        maxLength={4}
      />
      <Button
        variant="primary"
        className="block mx-auto"
        buttonText="verify"
        disabled={!otpValidationRegEx.test(otp)}
        // onClick={() => setCurrentStep(currentStep + 1)}
      />
    </motion.div>
  );
};

export default OtpStep;
