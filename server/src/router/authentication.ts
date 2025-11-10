import express from "express";
import { loggedInUser, login, logout, register, test } from "../controllers";
import { isAuthenticated } from "../utils/middleware";

export default (router: express.Router) => {
  router.post("/auth/register", register);
  router.post("/auth/login", login);
  router.post("/auth/logout", isAuthenticated, logout);
  router.post("/auth/test", isAuthenticated, test);
  router.get("/auth/me", isAuthenticated, loggedInUser);
};
