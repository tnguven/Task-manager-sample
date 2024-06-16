import type { Response } from "express";
import type { UserServiceType } from "./user.service";
import type { EmptyObj, ReqObj, ResObj } from "../types";

import httpStatus from "http-status";
import { setAuthCookies } from "../utils/set-auth-cookies";
import { generateAccessToken } from "../utils/jwt-helper";
import { serverConfig, secrets } from "../config";
import { logger } from "../logger";

type UserRequest = { email: string; password: string };

export const makeGetUser = (
  service: UserServiceType,
): ((req: ReqObj, res: Response) => Promise<ResObj>) => {
  return async (req) => {
    const user = await service.getUserById(Number(req.user?.id));
    if (user === null)
      return {
        statusCode: httpStatus.UNAUTHORIZED,
      };

    try {
      return {
        statusCode: httpStatus.OK,
        body: user,
      };
    } catch (err) {
      logger.error({ err }, "getUser: something went wrong");
      throw err;
    }
  };
};

export const makeDeleteUserByID = (
  service: UserServiceType,
): ((req: ReqObj) => Promise<ResObj>) => {
  return async (req) => {
    const id = req.user?.id;
    if (!id) return { statusCode: httpStatus.UNAUTHORIZED };

    try {
      await service.deleteUserById(id);
      return {
        statusCode: httpStatus.NO_CONTENT,
      };
    } catch (err) {
      logger.error({ err }, "deleteUserById: something went wrong");
      throw err;
    }
  };
};

export const makeCreateUser = (
  service: UserServiceType,
): ((req: ReqObj<EmptyObj, EmptyObj, UserRequest>, res: Response) => Promise<ResObj>) => {
  return async (req, res) => {
    try {
      const existingUser = await service.getUserByEmail(req.body.email);

      if (existingUser !== null) {
        return {
          statusCode: httpStatus.CONFLICT,
        };
      }

      const user = await service.createUser(req.body);
      const token = generateAccessToken(
        { id: user.id },
        secrets.token_secret,
        `${serverConfig.tokenMaxAge}s`,
      );

      setAuthCookies(res, token, serverConfig.tokenMaxAge);

      return {
        statusCode: httpStatus.CREATED,
        body: user,
      };
    } catch (err) {
      logger.error({ err }, "createUser: something went wrong");
      throw err;
    }
  };
};

export const makeLoginUser = (
  service: UserServiceType,
): ((req: ReqObj<EmptyObj, EmptyObj, UserRequest>, res: Response) => Promise<ResObj>) => {
  return async (req, res) => {
    const { email, password } = req.body;
    const user = await service.getUserByEmailPassword(email, password);

    if (user === null)
      return {
        statusCode: httpStatus.UNAUTHORIZED,
      };

    try {
      const token = generateAccessToken(
        { id: user.id },
        secrets.token_secret,
        `${serverConfig.tokenMaxAge}s`,
      );
      setAuthCookies(res, token, serverConfig.tokenMaxAge);

      return {
        statusCode: httpStatus.OK,
        body: user,
      };
    } catch (err) {
      logger.error({ err }, "loginUser: something went wrong");
      throw err;
    }
  };
};

export const logoutUser = (_req: ReqObj, res: Response) => {
  res.clearCookie("JWToken");
  return {
    statusCode: httpStatus.OK,
  };
};
