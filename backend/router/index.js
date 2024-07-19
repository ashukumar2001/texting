import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import ProfileController from "../controllers/profile.controller.js";
import ChatController from "../controllers/chat.controller.js";
import PushController from "../controllers/push.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import GeoLocationController from "../controllers/geolocation.controller.js";
const router = Router();
router.post("/authenticate", AuthController.authenticate);
router.post("/otp-request", authMiddleware, AuthController.sendOtp);
router.post("/verify-otp", authMiddleware, AuthController.verifyOtp);
router.post("/auth/refresh", AuthController.refreshTokens);
router.post("/get-user", AuthController.getUser);
router.post("/activate", authMiddleware, ProfileController.activate);
router.get("/chats", authMiddleware, ChatController.getInbox);
router.post("/inbox", authMiddleware, ChatController.createInbox);
router.get("/inbox", authMiddleware, ChatController.getInbox);
router.get("/search-user", authMiddleware, ChatController.searchUser);
router.get("/messages", authMiddleware, ChatController.getMessagesByGroup);
router.get("/generate-avatars-seeds", ProfileController.getAvatarSeeds);
router.get(
  "/get-ip-location",
  authMiddleware,
  GeoLocationController.getGeoLocation
);
router.get(
  "/get_online_status",
  authMiddleware,
  ChatController.getOnlineStatus
);
router.post(
  "/update-push-subscription",
  authMiddleware,
  PushController.updatePushSubscription
);
export default router;
