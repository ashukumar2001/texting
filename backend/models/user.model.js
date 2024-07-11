import mongoose from "mongoose";
import { generateUsername } from "unique-username-generator";
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
    userName: {
      type: String,
      required: false,
      trim: true,
      unique: true,
      default: () => generateUsername(),
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    isActivated: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema, "users");
