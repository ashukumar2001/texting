import mongoose from "mongoose";

const pushSubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    // unique: true,
  },
  subscription: {
    type: String,
    required: true,
  },
  userAgent: {
    type: String,
    require: true,
  },
});
export default mongoose.model(
  "PushSubscription",
  pushSubscriptionSchema,
  "pushSubscriptions"
);
