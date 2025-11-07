import express from "express";
import { createUser, getUserByEmail, getUserByUsername } from "../db";
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

    const salt = random();

    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    user.save();

    res.cookie("FLAGSHIP-AUTH-TOKEN", user.authentication.sessionToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Something went wrong." });
  }
};
