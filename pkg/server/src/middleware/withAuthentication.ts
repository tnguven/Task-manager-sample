import type { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

const hasUser = (req: Request) => !!req.user;

export function withAuthentication(req: Request, res: Response, next: NextFunction) {
  if (hasUser(req)) return next();

  res.sendStatus(httpStatus.UNAUTHORIZED);
}
