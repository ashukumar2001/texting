import { motion } from "framer-motion";
import { RefObject, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../Hooks/redux";
import useTimer from "../../Hooks/useTimer";
import { errorMessages, otpValidationRegEx } from "../../utils/constants";
import Button from "../Button/Button";
import Input from "../Input/Input";
import {
  useSendOtpRequestMutation,
  useVerifyOtpMutation,
} from "./authApiSlice";
import {
  backToMobileNumberStep,
  sendOtpRequestFulfilled,
  User,
  verifyOtpRequestFulfilled,
} from "./authSlice";
// import { verifyOtpRequestThunk } from "./authSlice";

const OtpStep = ({ className }: { className: string }) => {
  const [otp, setOtp] = useState<string>("");
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [sendOtpRequest, { error: resendOtpError }] =
    useSendOtpRequestMutation();
  const timer = useTimer(120);
  const { mobileNumber, hash } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const otpInputRef: RefObject<HTMLInputElement> = useRef(null);
  const currentPageStep = useAppSelector((state) => state.auth.currentPageStep);
  useEffect(() => {
    if (otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, []);

  const handleReSendOtpRequest = async () => {
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
        toast.success(`otp sent to ${mobileNumber}`);
        dispatch(
          sendOtpRequestFulfilled({
            hash: sendOtpResponse.data?.hash,
            mobileNumber: sendOtpResponse.data?.mobileNumber,
            resend: true,
          })
        );
        timer.restartTimer();
      }
    } catch (error) {}
  };

  const handleVerifyOtp = async () => {
    try {
      const verifyOtpResponse = await verifyOtp({
        mobileNumber,
        hash,
        otp,
      }).unwrap();
      if (verifyOtpResponse?.status) {
        const { user } = verifyOtpResponse;
        const { mobileNumber, isMobileVerified, _id, isActivated }: User = user;

        dispatch(
          verifyOtpRequestFulfilled({
            user: {
              mobileNumber,
              isMobileVerified,
              isActivated,
              _id,
            },
            otp: "",
            hash: "",
            isMobileVerified,
            mobileNumber: "",
            currentPageStep: currentPageStep + 1,
          })
        );
      }
    } catch (error) {}
  };
  useEffect(() => {
    if (resendOtpError) {
      toast.error(
        (
          resendOtpError as {
            data: { status: boolean; message: string };
            status: number;
          }
        ).data?.message || errorMessages.serverError
      );
    }
  }, [resendOtpError]);
  return (
    <motion.div
      initial={{ opacity: 0, x: 120 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -120 }}
      transition={{ duration: 0.3, type: "keyframes" }}
      className={className || ""}
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
      <div className="flex justify-between items-center w-52 mx-auto">
        {/* <Button
          variant="stroke"
          className="block"
          buttonText="go back"
          onClick={() => dispatch(backToMobileNumberStep())}
        /> */}

        {timer.seconds > 0 || timer.minutes > 0 ? (
          <div className="w-12 flex justify-center">
            {timer.timeString?.split("").map((digit) => (
              <span className="w-1/2 text-gray-600 text-center text-sm">
                {digit}
              </span>
            ))}
          </div>
        ) : (
          <Button
            variant="stroke"
            className="block"
            buttonText="resend"
            onClick={() => {
              handleReSendOtpRequest();
            }}
          />
        )}
        <Button
          variant="primary"
          className="block"
          buttonText="verify"
          disabled={!otpValidationRegEx.test(otp)}
          onClick={() => handleVerifyOtp()}
        />
      </div>
    </motion.div>
  );
};

export default OtpStep;
