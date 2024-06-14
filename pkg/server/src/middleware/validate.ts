import httpStatus from "http-status";
import type { Request, Response, NextFunction } from "express";
import { Schema, ZodError } from "zod";

export function validate(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (err) {
      console.error(err);
      if (err instanceof ZodError) {
        return res.status(httpStatus.BAD_REQUEST).send(err.errors);
      }

      return res.status(httpStatus.BAD_REQUEST);
    }
  };
}
