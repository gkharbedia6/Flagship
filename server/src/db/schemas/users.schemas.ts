import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String },
    username: { type: String },
    email: { type: String, required: true },
    imageUrl: { type: String },
    authentication: {
      password: { type: String, required: true, select: false },
      salt: { type: String, select: false },
      sessionToken: { type: String, select: false },
      refreshToken: { type: String, select: false },
    },
  },
  {
    timestamps: true,
  }
);

const UnverifiedUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    authentication: {
      password: { type: String, required: true, select: false },
      salt: { type: String, select: false },
    },
  },
  {
    timestamps: true,
  }
);

UnverifiedUserSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 60 });

const ForgotPasswordUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

ForgotPasswordUserSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 60 });

export const UserModel = mongoose.model("User", UserSchema);
export const UnverifiedUserModel = mongoose.model(
  "Verification",
  UnverifiedUserSchema
);
export const ForgotPasswordUserModel = mongoose.model(
  "Forgot Password",
  ForgotPasswordUserSchema
);
