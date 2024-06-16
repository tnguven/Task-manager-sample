import type { Response, NextFunction } from "express";
import type { ParamType, QueryType, ReqObj, ResObj } from "../types";
import httpStatus from "http-status";
import { logger } from "../logger";

export type Params = { [key: string]: string };

export function makeExpressCallback<
  P extends ParamType = ParamType,
  Q extends QueryType = QueryType,
  B extends object = never,
>(controller: (req: ReqObj<P, Q, B>, res: Response) => Promise<ResObj> | ResObj) {
  return async function expressCallback(req: ReqObj<P, Q, B>, res: Response, _next: NextFunction) {
    try {
      const httpResponse = await controller(req, res);

      res.status(httpResponse.statusCode);
      res.set({
        "Content-type": "application/json",
        ...(httpResponse.headers && httpResponse.headers),
      });

      if (httpResponse?.redirect) return res.redirect(httpResponse.redirect);

      res.type("json");
      res.send(httpResponse?.body ?? { success: httpStatus.OK });
    } catch (err) {
      logger.error(err);
      res.status(500).send({ error: "An unknown error occurred." });
    }
  };
}
