import type { Request } from "express";
import type { User } from "./user/user.model";

declare module "express" {
  interface Request {
    secret?: string | undefined;
    cookies: Record<string, any>;
    signedCookies: Record<string, any>;
    user?: User;
  }
}

export type QueryType = { [key: string]: undefined | string | string[] | QueryType | QueryType[] };

export type ParamType = Record<string, string>;

export type ReqObj<
  P extends ParamType = ParamType,
  Q extends QueryType = QueryType,
  B extends object = any,
> = Request<P, any, B, Q, Record<string, any>>;

export type ResObj = {
  statusCode: number;
  body?: Record<string, unknown> | Record<string, unknown>[];
  headers?: Record<string, string>;
  redirect?: string;
};

export type EmptyObj = Record<string, never>;
