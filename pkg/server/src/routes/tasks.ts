import type { CreateTaskReqBody, OrderUpdateReqBody } from "task/task.model";
import type { EmptyObj } from "../types";

import { Router } from "express";
import { makeExpressCallback } from "../middleware/expressCallback";
import { validate } from "../middleware/validate";
import { getTasks, createTask, updateTasksPositions } from "../task/task.module";
import { CreateTaskSchema, UpdateTasksPositionSchema } from "../task/validate";

export const router = Router();

router
  .route("/")
  .get(makeExpressCallback(getTasks))
  .post(
    validate(CreateTaskSchema),
    makeExpressCallback<EmptyObj, EmptyObj, CreateTaskReqBody>(createTask),
  )
  .put(
    validate(UpdateTasksPositionSchema),
    makeExpressCallback<EmptyObj, EmptyObj, OrderUpdateReqBody[]>(updateTasksPositions),
  )
  .delete(
    validate(UpdateTasksPositionSchema),
    makeExpressCallback<EmptyObj, EmptyObj, { taskId: string }>(updateTasksPositions),
  );
