import express from "express";
import { createUser, getUserByEmail } from "../db";
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
