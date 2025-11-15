import express from "express";
import { getUserByRefreshToken } from "../db";
import { get, merge } from "lodash";
import { authentication, random } from "./token-encryptor";

const isProd = process.env.NODE_ENV === "production";

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as string | unknown;

    if (!currentUserId) {
      return res.status(403).json({ message: "Forbidden." });
    }

    if (currentUserId.toString() !== id) {
      return res.status(403).json({ message: "Forbidden." });
    }

    return next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<any> => {
  try {
    const sessionToken = req.cookies["FLAGSHIP_SESSION_TOKEN"];
    const refreshToken = req.cookies["FLAGSHIP_REFRESH_TOKEN"];
    const existingUser = await getUserByRefreshToken(refreshToken);

    if (!existingUser || !existingUser.authentication) {
      return res.status(401).json({ message: "User does not exist." });
    }

    if (!sessionToken) {
      if (!refreshToken) {
        return res.status(401).json({ message: "Unauthorized." });
      }

      const sessionSalt = random();
      existingUser.authentication.sessionToken = authentication(
        sessionSalt,
        existingUser._id.toString()
      );

      existingUser.save();

      res.cookie(
        "FLAGSHIP_SESSION_TOKEN",
        existingUser.authentication?.sessionToken,
        {
          httpOnly: true,
          secure: isProd,
          sameSite: isProd ? "none" : "lax",
          path: "/",
          maxAge: 60 * 60 * 1000,
        }
      );
    }

    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};
