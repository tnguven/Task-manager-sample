import type { User } from "../user/user.model";
import jwt from "jsonwebtoken";

export const makeGenerateAccessToken = (tokenSecret: string, expiresIn: string) => {
  return (userInfo: { id: number }) => generateAccessToken(userInfo, tokenSecret, expiresIn);
};

export const generateAccessToken = (userInfo: User, tokenSecret: string, expiresIn = "100s") =>
  jwt.sign(userInfo, tokenSecret, { expiresIn });

export const makeVerifyJwtToken = (tokenSecret: string) => {
  return (token: string) =>
    new Promise((resolve, reject) => {
      jwt.verify(token, tokenSecret, (err, user) => {
        if (err) reject(err);

        resolve(user);
      });
    });
};
