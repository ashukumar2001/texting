import React, { useState } from "react";
import { motion } from "framer-motion";
import Input from "../Input/Input";
import { useUpdateUserNameMutation } from "./authApiSlice";
import Loader from "../Loader/Dots";
import Button from "../Button/Button";
import { userNameValidationRegEx } from "../../utils/constants";
const UserNameStep = () => {
  const [userName, setUserName] = useState("");
  const [updateUserName, { isLoading }] = useUpdateUserNameMutation();

  const handleUpdateUserName = async () => {
    try {
      const updateUserNameResponse = await updateUserName(userName).unwrap();
      if (updateUserNameResponse.status) {
        // update user name in redux state
        // dispatch(updateUserNameFulfilled(updateUserNameResponse.data));
        // navigate to next step
      }
    } catch (error) {}
  };
  return (
    <motion.div
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -120 }}
      transition={{ duration: 0.3, type: "keyframes" }}
    >
      <Input
        type="text"
        className="text-center"
        placeholder="username..."
        value={userName}
        onChange={(e) => {
          const value = e.target.value;
          if (value === "" || userNameValidationRegEx.test(value)) {
            setUserName(value);
          }
        }}
        maxLength={10}
      />
      {isLoading ? (
        <Loader width={64} />
      ) : (
        <Button
          variant="primary"
          disabled={!!userName}
          className="block mx-auto"
          buttonText="get otp"
          onClick={() => {
            handleUpdateUserName();
            setUserName("");
          }}
        />
      )}
    </motion.div>
  );
};

export default UserNameStep;
