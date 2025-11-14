import express from "express";
import { isAuthenticated } from "../utils/middleware";
import {
  recoverPassword,
  requestForgotPasswordCode,
  signedInUser,
  signIn,
  signOut,
  signUp,
  submitForgotPasswordCode,
  verifyEmail,
} from "../controllers";

export default (router: express.Router) => {
  router.post("/auth/sign-up", signUp);
  router.post("/auth/email-verification", verifyEmail);
  router.post("/auth/sign-in", signIn);
  router.post("/auth/sign-out", isAuthenticated, signOut);
  router.get("/auth/me", isAuthenticated, signedInUser);
  router.post("/auth/request-code", requestForgotPasswordCode);
  router.post("/auth/submit-code", submitForgotPasswordCode);
  router.post("/auth/recover-password", recoverPassword);
};
