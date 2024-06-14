import { Router } from "express";

import { LoginSchema } from "../user/validation";
import { validate } from "../middleware/validate";

import { deleteUserByID, createUser, loginUser, logoutUser, getUser } from "../user/user.module";
import { makeExpressCallback } from "../middleware/expressCallback";
import { withAuthentication } from "../middleware/withAuthentication";
import { EmptyObj } from "../types";

export const router = Router();

router
  .route("/")
  .get(withAuthentication, makeExpressCallback(getUser))
  .post(
    validate(LoginSchema),
    makeExpressCallback<EmptyObj, EmptyObj, { email: string; password: string }>(createUser),
  )
  .delete(withAuthentication, makeExpressCallback(deleteUserByID));

router
  .route("/login")
  .post(
    validate(LoginSchema),
    makeExpressCallback<EmptyObj, EmptyObj, { email: string; password: string }>(loginUser),
  );

router.route("/logout").post(withAuthentication, makeExpressCallback(logoutUser));
