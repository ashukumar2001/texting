import mongoose from "mongoose";

const { Schema } = mongoose;

const loginActivity = new mongoose.Schema(
  {
    token: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("LoginActivity", loginActivity, "loginActivity");
