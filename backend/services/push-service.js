import webpush from "web-push";
import {
  GCM_API_KEY,
  VAPID_KEY_PUBLIC,
  VAPID_KEY_PRIVATE,
} from "../config/index.js";
import { PushSubscriptionModel } from "../models/index.js";
class PushService {
  constructor() {
    // super();
    this.webpush = webpush;
    // this.webpush.setGCMAPIKey(GCM_API_KEY);
    this.webpush.setVapidDetails(
      "mailto:ak.dev.techonologies@gmail.com",
      VAPID_KEY_PUBLIC,
      VAPID_KEY_PRIVATE
    );
    // console.log({ VAPID_KEY_PUBLIC, VAPID_KEY_PRIVATE });
  }

  async sendNotification(userId, text) {
    const pushSubscriptions = await PushSubscriptionModel.find({ userId });
    if (pushSubscriptions) {
      await pushSubscriptions?.forEach(async (pushSubscription) => {
        if (pushSubscription && pushSubscription.subscription) {
          const subscription = JSON.parse(pushSubscription.subscription);
          if (subscription && subscription?.endpoint) {
            try {
              await this.webpush.sendNotification(subscription, text);
            } catch (error) {
              // Check for error code 410 [expired subscription]
              if (error && error?.statusCode === 410) {
                await PushSubscriptionModel.findByIdAndDelete(
                  pushSubscription._id
                );
              }
            }
          }
        }
      });
    }
  }
}

export default new PushService();
