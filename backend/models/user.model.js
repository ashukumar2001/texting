import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: false,
      trim: true,
    },
    profilePicture: {
      type: String,
      require: false,
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: false,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    isMobileVerified: {
      type: Boolean,
      required: false,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    isActivated: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema, "users");
