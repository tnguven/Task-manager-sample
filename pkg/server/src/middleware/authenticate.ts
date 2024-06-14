import type { Request, Response, NextFunction } from "express";
import type { User } from "../user/user.model";

import { secrets, serverConfig } from "../config";
import { makeGenerateAccessToken, makeVerifyJwtToken } from "../utils/jwt-helper";
import { setAuthCookies } from "../utils/set-auth-cookies";

const generateAccessToken = makeGenerateAccessToken(
  secrets.token_secret,
  `${serverConfig.tokenMaxAge}s`,
);
const verifyJwtToken = makeVerifyJwtToken(secrets.token_secret);

export async function authenticateCookie(req: Request, res: Response, next: NextFunction) {
  const JWToken = req?.cookies?.JWToken;
  if (!JWToken) return next();

  try {
    const { id } = (await verifyJwtToken(JWToken)) as unknown as User;
    req.user = { id: Number(id) };

    // Will generate every five min if the token does not expires;
    // Just adhoc solution to keep user logged in for the purpose of this example
    const token = generateAccessToken(req.user);
    setAuthCookies(res, token, serverConfig.tokenMaxAge);
  } catch (err) {
    console.error(err);
  }

  next();
}
