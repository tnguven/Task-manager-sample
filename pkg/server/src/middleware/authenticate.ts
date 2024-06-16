import type { Request, Response, NextFunction } from "express";
import type { User, UserModel } from "../user/user.model";

import { secrets, serverConfig } from "../config";
import { dbPool } from "../db/connect";
import { makeGenerateAccessToken, makeVerifyJwtToken } from "../utils/jwt-helper";
import { setAuthCookies } from "../utils/set-auth-cookies";
import { logger } from "../logger";

const generateAccessToken = makeGenerateAccessToken(
  secrets.token_secret,
  `${serverConfig.tokenMaxAge}s`,
);
const verifyJwtToken = makeVerifyJwtToken(secrets.token_secret);

export async function authenticateCookie(req: Request, res: Response, next: NextFunction) {
  const JWToken = req?.cookies?.JWToken;
  if (!JWToken) return next();

  const clearCookie = () => {
    res.clearCookie("JWToken");
    res.removeHeader("set-cookie");
  };

  try {
    const { id } = (await verifyJwtToken(JWToken)) as unknown as User;
    const { rows, rowCount } = await dbPool.query<UserModel>("SELECT id FROM users WHERE id = $1", [
      id,
    ]);

    if (rowCount) {
      req.user = rows[0];

      // Will generate every ten min if the token does not expires;
      // Just adhoc solution to keep user logged in for the purpose of this example
      const token = generateAccessToken(req.user);
      setAuthCookies(res, token, serverConfig.tokenMaxAge);
    } else {
      clearCookie();
    }
  } catch (err) {
    logger.error({ err }, "authenticateCookie: something went wrong")
    clearCookie();
  }

  next();
}
