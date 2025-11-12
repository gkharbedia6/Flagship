import { createHmac, randomBytes, randomInt } from "crypto";
import dotenv from "dotenv";
dotenv.config();

const SECRET = process.env.RANDOM_SECRET_KEY as string;

export const random = () => randomBytes(128).toString("base64");
export const authentication = (salt: string, password: string) => {
  if (!SECRET) {
    throw new Error("Missing RANDOM_SECRET_KEY in environment variables");
  }
  return createHmac("sha256", [salt, password].join("/"))
    .update(SECRET)
    .digest("hex");
};

export const generateVerificationCode = (): string => {
  return randomInt(100000, 1000000).toString();
};
