import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { authenticateRequestSuccess, User } from "./authSlice";
import { useAppDispatch } from "../../Hooks/redux";
import { useAuthenticateMutation } from "./authApiSlice";

const SignInStep = () => {
  const [authenticate, { isLoading }] = useAuthenticateMutation();
  const dispatch = useAppDispatch();

  const handleAuthResponse = async (res: CredentialResponse) => {
    try {
      const authenticateResponse: {
        status: boolean;
        data: {
          user: User;
          accessToken: string;
        };
      } = await authenticate({
        token: res.credential,
      }).unwrap();
      if (authenticateResponse?.status) {
        dispatch(
          authenticateRequestSuccess({
            ...authenticateResponse.data,
          })
        );
      }
    } catch (error) {}
  };

  useEffect(() => {
    const signInDiv: string | HTMLElement = (document.getElementById(
      "signInDiv"
    ) || "") as string;
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleAuthResponse,
    });
    google.accounts.id.renderButton(signInDiv, {
      theme: "filled_black",
      size: "large",
      type: "standard",
    });
    google.accounts.id.prompt(() => {});
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -120 }}
      transition={{ duration: 0.3, type: "keyframes" }}
    >
      <div id="signInDiv" className="mx-auto mt-8 w-fit"></div>
    </motion.div>
  );
};

export default SignInStep;
