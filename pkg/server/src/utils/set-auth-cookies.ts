import type { Response } from "express";
import { serialize } from "cookie";

export const setAuthCookies = (res: Response, token: string, maxAge: number) => {
  res.setHeader(
    "Set-Cookie",
    serialize("JWToken", token, {
      httpOnly: true,
      secure: true,
      maxAge,
      sameSite: "strict",
      path: "/",
    }),
  );
};
