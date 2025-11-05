import { Router } from "express";
import { register } from "../controllers";

export default (router: Router) => {
  router.post("/auth/register", register);
};
