import { PushSubscriptionModel } from "../models/index.js";
import { ErrorHandlerService } from "../services/index.js";

class PushController {
  async updatePushSubscription(req, res, next) {
    const pushSubscription = req?.body?.pushSubscription;
    const userAgent = req?.body?.userAgent;
    const pushSubscriptionParsed = JSON.parse(pushSubscription);
    if (
      !pushSubscriptionParsed ||
      !pushSubscriptionParsed.endpoint ||
      !userAgent
    ) {
      return next(ErrorHandlerService.validationError("Invalid subscription"));
    }
    let subscriptionResponse;
    try {
      subscriptionResponse = await PushSubscriptionModel.create({
        userId: req?.user?.id,
        subscription: pushSubscription,
        userAgent,
      });
    } catch (error) {
      return next(error);
    }
    if (subscriptionResponse) {
      res.status(200).send({ status: true, data: subscriptionResponse });
    } else {
      res.status(200).send({ status: false });
    }
  }
}
export default new PushController();
