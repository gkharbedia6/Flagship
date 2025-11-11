import express from "express";
import { isAuthenticated } from "../utils/middleware";
import { signedInUser, signIn, signOut, signUp } from "../controllers";

export default (router: express.Router) => {
  router.post("/auth/sign-up", signUp);
  router.post("/auth/sign-in", signIn);
  router.post("/auth/sign-out", isAuthenticated, signOut);
  router.get("/auth/me", isAuthenticated, signedInUser);
};
