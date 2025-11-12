import express from "express";
import {
  createForgotPasswordUser,
  createUnvefiriedUser,
  createUser,
  deleteUnverifiedUserById,
  getFOrgotPasswordUserByEmail,
  getUnverifiedUserByEmail,
  getUserByEmail,
  getUserById,
  updateForgotPasswordUserById,
  updateUnverifiedUserById,
} from "../db";
import { authentication, generateVerificationCode, random } from "../utils";
import { Resend } from "resend";
import mongoose from "mongoose";

const resend = new Resend("re_2pXTXX7o_3SbDc88z8k1UYdwzneWtrAsn");

export const signUp = async (
  req: express.Request,
  res: express.Response
): Promise<any | Error> => {
  try {
    const { email, password } = req.body;

    if (!password || !email) {
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

    const verification = {
      code: generateVerificationCode(),
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 mins
    };

    const timeVerificationExpiry = verification.expiresAt - Date.now();

    const response = await resend.emails.send({
      from: "Flagship Verify <flagshipverify@vvharts.com>",
      to: email,
      template: {
        id: "email-verification-code",
        variables: {
          verification_code: verification.code,
          verification_code_expiry: Math.ceil(
            timeVerificationExpiry / (1000 * 60)
          ).toString(),
        },
      },
    });

    if (response.error) {
      console.error("Resend email error:", response.error);
      return res.status(500).json({
        message: "Failed to send verification email.",
        error: response.error,
      });
    }

    const existingUnverifiedUser = await getUnverifiedUserByEmail(email);

    const salt = random();

    if (!existingUnverifiedUser) {
      await createUnvefiriedUser({
        email,
        code: verification.code,
        expiresAt: verification.expiresAt,
        authentication: {
          salt,
          password: authentication(salt, password),
        },
      });
    }

    await updateUnverifiedUserById(
      {
        code: verification.code,
        expiresAt: verification.expiresAt,
      },
      existingUnverifiedUser?.id
    );

    const sendVerificationResponse = {
      email,
      verificationExpires: verification.expiresAt,
    };

    return res.status(200).json({
      message: "Verification code was sent to your email.",
      data: sendVerificationResponse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

export const verifyEmail = async (
  req: express.Request,
  res: express.Response
): Promise<any | Error> => {
  const session = await mongoose.startSession();

  try {
    const { email, verificationCode } = req.body;

    if (!verificationCode) {
      return res.status(400).json({ message: "Reset code was not provided." });
    }

    if (!email) {
      return res.status(400).json({ message: "Session timed out." });
    }

    const checkUserByEmail = await getUserByEmail(email);

    if (checkUserByEmail) {
      return res
        .status(400)
        .json({ message: "User with that email already exists." });
    }

    const existingUnverifiedUser = await getUnverifiedUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!existingUnverifiedUser || !existingUnverifiedUser.authentication) {
      return res.status(404).json({
        message: "Session timed out.",
      });
    }

    if (verificationCode !== existingUnverifiedUser.code) {
      return res.status(404).json({
        message: "Incorrect verification code.",
      });
    }

    session.startTransaction();

    const user = await createUser({
      email,
      authentication: {
        password: existingUnverifiedUser.authentication.password,
        salt: existingUnverifiedUser.authentication.salt,
      },
    });

    await deleteUnverifiedUserById(existingUnverifiedUser.id);

    await session.commitTransaction();

    // const { authentication: authData, ...safeUser } = user;

    return res.status(200).json({ message: "Sign up successful." }).end();
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    return res.status(500).json({ message: "Something went wrong." });
  } finally {
    session.endSession();
  }
};

export const signIn = async (
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
    return res.status(500).json({ message: "Something went wrong." });
  }
};

export const signOut = async (
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
    return res.status(500).json({ message: "Something went wrong." });
  }
};

interface AuthenticatedRequest extends express.Request {
  identity?: any;
}

export const signedInUser = async (
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
    return res.status(500).json({ message: "Something went wrong." });
  }
};

export const requestForgotPasswordCode = async (
  req: express.Request,
  res: express.Response
): Promise<any | Error> => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is not provided." });
    }

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.authentication) {
      return res
        .status(404)
        .json({ message: "User with this email does not exist." });
    }

    const verification = {
      code: generateVerificationCode(),
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 mins
    };

    const timeVerificationExpiry = verification.expiresAt - Date.now();
    const response = await resend.emails.send({
      from: "Flagship Verify <flagshipverify@vvharts.com>",
      to: email,
      template: {
        id: "password-reset-verification-1",
        variables: {
          verification_code: verification.code,
          verification_code_expiry: Math.ceil(
            timeVerificationExpiry / (1000 * 60)
          ).toString(),
        },
      },
    });

    if (response.error) {
      console.error("Resend email error:", response.error);
      return res.status(500).json({
        message: "Failed to send reset code email.",
        error: response.error,
      });
    }

    const existingForgotPasswordUser = await getFOrgotPasswordUserByEmail(
      email
    );

    if (!existingForgotPasswordUser) {
      await createForgotPasswordUser({
        email,
        code: verification.code,
        expiresAt: verification.expiresAt,
      });
    }

    await updateForgotPasswordUserById(
      {
        code: verification.code,
        expiresAt: verification.expiresAt,
      },
      existingForgotPasswordUser?.id
    );

    return res.status(200).json({
      message: "Reset code was sent to your email.",
      data: { email: email, verificationExpires: verification.expiresAt },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

export const submitForgotPasswordCode = async (
  req: express.Request,
  res: express.Response
): Promise<any | Error> => {
  try {
    const { verificationCode, email } = req.body;

    if (!verificationCode) {
      return res.status(400).json({ message: "Reset code was not provided." });
    }

    if (!email) {
      return res.status(400).json({ message: "Session timed out." });
    }

    const existingForgotPasswordUser = await getFOrgotPasswordUserByEmail(
      email
    );

    if (!existingForgotPasswordUser) {
      return res.status(404).json({
        message: "Session timed out.",
      });
    }

    if (verificationCode !== existingForgotPasswordUser.code) {
      return res.status(404).json({
        message: "Incorrect verification code.",
      });
    }

    return res.status(200).json({
      message: "Verification succesful.",
      data: {
        email,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};
