import { useEffect, useState } from "react";
import Button from "../Button/Button";
import Input from "../Input/Input";
import { motion } from "framer-motion";
import { selectAccessToken, sendOtpRequestFulfilled } from "./authSlice";
import { useAppDispatch, useAppSelector } from "../../Hooks/redux";
import {
  useAuthenticateMutation,
  useSendOtpRequestMutation,
} from "./authApiSlice";
import { errorMessages, mobileValidationRegEx } from "../../utils/constants";
import Loader from "../Loader/Dots";
import { toast } from "react-toastify";

const MobileNumberStep = () => {
  const [sendOtpRequest, { isLoading, error, data }] =
    useSendOtpRequestMutation();
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const dispatch = useAppDispatch();

  const handleSendOtp = async () => {
    try {
      const sendOtpResponse: {
        status: boolean;
        data: {
          hash: string;
          mobileNumber: string;
        };
      } = await sendOtpRequest({
        mobileNumber,
      }).unwrap();

      if (sendOtpResponse.status) {
        dispatch(
          sendOtpRequestFulfilled({
            hash: sendOtpResponse.data?.hash,
            mobileNumber: sendOtpResponse.data?.mobileNumber,
          })
        );
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (error) {
      toast.error(
        (
          error as {
            data: { status: boolean; message: string };
            status: number;
          }
        ).data?.message || errorMessages.serverError
      );
    }
  }, [error]);

  //   const handleAuthResponse = async (res: CredentialResponse) => {
  //     try {
  //       const authenticateResponse: { status: boolean; data: User } =
  //         await authenticate({
  //           token: res.credential,
  //         }).unwrap();
  //       if (authenticateResponse?.status) {
  //         dispatch(
  //           authenticateRequestSuccess({
  //             ...authenticateResponse.data,
  //           })
  //         );
  //       }
  //     } catch (error) {}
  //   };

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
      {isLoading ? (
        <Loader width={64} />
      ) : (
        <Button
          variant="primary"
          disabled={!mobileValidationRegEx.test(mobileNumber)}
          className="block mx-auto"
          buttonText="get otp"
          onClick={() => {
            handleSendOtp();
            setMobileNumber("");
          }}
        />
      )}
    </motion.div>
  );
};

export default MobileNumberStep;
