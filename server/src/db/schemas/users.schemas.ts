import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String },
    username: { type: String, required: true },
    email: { type: String, required: true },
    authentication: {
      password: { type: String, required: true, select: false },
      salt: { type: String, select: false },
      sessionToken: { type: String, select: false },
      refreshToken: { type: String, select: false },
    },
    isVefified: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model("User", UserSchema);
