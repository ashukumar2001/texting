import mongoose from "mongoose";

const federateLoginSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  provider: {
    type: String,
    required: true,
    trim: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
});

export default mongoose.model(
  "FederateLogin",
  federateLoginSchema,
  "federateLogins"
);
