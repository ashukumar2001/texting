import { motion } from "framer-motion";
import { useState } from "react";
import { useAppDispatch } from "../../Hooks/redux";
import Button from "../Button/Button";
import Input from "../Input/Input";
import { useActivateAccountMutation } from "./authApiSlice";
import { activateUserFullfilled } from "./authSlice";
const NameInputStep = () => {
  const [fullName, setFullName] = useState("");
  const dispatch = useAppDispatch();
  const [activateAccount, { isLoading, isSuccess }] =
    useActivateAccountMutation();

  const handleActivateAccount = async () => {
    try {
      const activateAccountResponse = await activateAccount({ fullName });
      if ("data" in activateAccountResponse && activateAccountResponse.data) {
        dispatch(
          activateUserFullfilled({
            isUserAuthenticated:
              activateAccountResponse.data.isUserAuthenticated,
            fullName: activateAccountResponse.data.fullName,
          })
        );
      }
    } catch (error) {}
  };
  return (
    <motion.div
      initial={{ opacity: 0, x: 120 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -120 }}
      transition={{ duration: 0.3, type: "keyframes" }}
    >
      <Input
        value={fullName}
        onChange={(e) => {
          const { value } = e.target;
          setFullName(value);
        }}
        className="tracking-wider text-center"
        placeholder="enter your name"
        spellCheck={false}
      />
      <Button
        variant="primary"
        className="block mx-auto"
        buttonText="next"
        disabled={!fullName}
        onClick={handleActivateAccount}
      />
    </motion.div>
  );
};

export default NameInputStep;
