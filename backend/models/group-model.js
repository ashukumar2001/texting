import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    isMultiple: {
      type: Boolean,
      default: false,
    },
    displayName: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Group", groupSchema, "groups");
