import express from "express";
import {
  createUser,
  getUserByEmail,
  getUserById,
  getUserByUsername,
} from "../db";
import { authentication, random } from "../utils";

export const register = async (
  req: express.Request,
  res: express.Response
): Promise<any | Error> => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ message: "You have not provided all required fields." });
    }

    const checkUserByUsername = await getUserByUsername(username);

    if (checkUserByUsername) {
      return res
        .status(400)
        .json({ message: "User with that username already exists." });
    }

    const checkUserByEmail = await getUserByEmail(email);

    if (checkUserByEmail) {
      return res
        .status(400)
        .json({ message: "User with that email already exists." });
    }

    const salt = random();

    const user = await createUser({
      username,
      email,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Something went wrong." });
  }
};

export const login = async (
  req: express.Request,
  res: express.Response
): Promise<any | Error> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "You have not provided all required fields." });
    }

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!user || !user.authentication || !user.authentication.salt) {
      return res.status(400).json({ message: "User does not exist." });
    }

    const expectedHash = authentication(user.authentication.salt, password);

    if (expectedHash !== user.authentication?.password) {
      return res.status(400).json({ message: "Incorrect password." });
    }

    const sessionSalt = random();
    const refreshSalt = random();

    user.authentication.sessionToken = authentication(
      sessionSalt,
      user._id.toString()
    );

    user.authentication.refreshToken = authentication(
      refreshSalt,
      user._id.toString()
    );

    user.save();

    res.cookie("FLAGSHIP_SESSION_TOKEN", user.authentication.sessionToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      // maxAge: 1 * 60 * 1000,
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("FLAGSHIP_REFRESH_TOKEN", user.authentication.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      // maxAge: 2 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const safeUser = user.toObject();
    if (!safeUser.authentication) return;
    delete safeUser.authentication.sessionToken;
    delete safeUser.authentication.refreshToken;

    return res.status(200).json(safeUser).end();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Something went wrong." });
  }
};

export const logout = async (
  req: express.Request,
  res: express.Response
): Promise<any | Error> => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(401).json({ message: "User id is not provided." });
    }

    const existingUser = await getUserById(id);

    if (!existingUser || !existingUser.authentication) {
      return res.status(404).json({ message: "User does not exist." });
    }

    delete existingUser.authentication.refreshToken;
    delete existingUser.authentication.sessionToken;
    existingUser.save();

    res.clearCookie("FLAGSHIP_SESSION_TOKEN", {
      path: "/",
      sameSite: "lax",
    });
    res.clearCookie("FLAGSHIP_REFRESH_TOKEN", {
      path: "/",
      sameSite: "lax",
    });

    return res.status(200).json({ messsage: "Logged out." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Something went wrong. logout" });
  }
};

interface AuthenticatedRequest extends express.Request {
  identity?: any;
}

export const loggedInUser = async (
  req: AuthenticatedRequest,
  res: express.Response
): Promise<any | Error> => {
  try {
    const { identity } = req;

    if (!identity) {
      return res.status(401).json({ message: "Unautharized." });
    }

    return res.status(200).json(identity).end();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Something went wrong." });
  }
};

export const test = async (
  req: AuthenticatedRequest,
  res: express.Response
): Promise<any | Error> => {
  try {
    return res.status(200).json({ name: "lol" }).end();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Something went wrong." });
  }
};
