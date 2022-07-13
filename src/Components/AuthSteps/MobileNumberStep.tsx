import { Dispatch, SetStateAction, useState } from "react";
import Button from "../Button/Button";
import Input from "../Input/Input";
import { motion } from "framer-motion";

const MobileNumberStep = ({
  currentStep,
  setCurrentStep,
}: {
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
}) => {
  const [mobileNumber, setMobileNumber] = useState<string>("");

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
          setMobileNumber(e.target.value);
        }}
      />
      <Button
        variant="primary"
        className="block mx-auto"
        buttonText="get otp"
        onClick={() => setCurrentStep(currentStep + 1)}
      />
    </motion.div>
  );
};

export default MobileNumberStep;
