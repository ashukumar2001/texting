import { useCallback, useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { useUpdatePushSubscriptionMutation } from "../../api/apiSlice";
import { useAppSelector } from "../../Hooks/redux";
import { urlB64ToUint8Array } from "../../utils/helpers";
import { selectLoginUser } from "../AuthSteps/authSlice";

interface ErrorInterface {
  data: string;
  error: string;
  originStatus: number;
  status: string;
}

const PWA = () => {
  const user = useAppSelector(selectLoginUser);
  const [updatePushSubscription] = useUpdatePushSubscriptionMutation();
  const [swRegistration, setSwRegistration] =
    useState<ServiceWorkerRegistration | null>();
  const {} = useRegisterSW({
    immediate: true,
    onRegistered(registration) {
      setSwRegistration(registration);
    },
  });

  const subscribeUserToPush = useCallback(() => {
    const applicationServerKey = urlB64ToUint8Array(
      import.meta.env.VITE_APPLICATION_SERVER_KEY
    );
    swRegistration?.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      })
      .then((subscription) => {
        // save subscription to server
        saveSubscriptionToServer(subscription);
      });
  }, [swRegistration]);

  const saveSubscriptionToServer = useCallback(
    async (subscription: PushSubscription) => {
      try {
        await updatePushSubscription({
          subscription,
          userAgent: navigator.userAgent,
        }).unwrap();
      } catch (error) {
        // unsubscribe if request is not successfull
        if (error && (error as ErrorInterface)?.originStatus !== 401) {
          subscription.unsubscribe();
        }
      }
    },
    []
  );

  useEffect(() => {
    if (swRegistration) {
      swRegistration?.pushManager.getSubscription().then((subs) => {
        const isSubscribed = !(subs === null);
        // subscribe logged in user
        if (!isSubscribed && user.isMobileVerified && user.mobileNumber) {
          if (Notification.permission === "granted") {
            subscribeUserToPush();
          } else {
            // ask to allow notifications
            Notification.requestPermission().then((permission) => {
              if (permission === "granted") subscribeUserToPush();
            });
          }
          // unsubscribe if user is logged out
        } else if (isSubscribed && (!user.isActivated || !user.mobileNumber)) {
          subs.unsubscribe();
        }
      });
    }
  }, [user.isMobileVerified, user.mobileNumber, swRegistration]);
  return <></>;
};

export default PWA;
