import type { TaskServiceType } from "./task.service";
import type { EmptyObj, ReqObj, ResObj } from "../types";
import type { CreateTaskReqBody, OrderUpdateReqBody } from "./task.model";
import { logger } from "../logger";

import httpStatus from "http-status";

export const makeGetTasks =
  (service: TaskServiceType): ((req: ReqObj) => Promise<ResObj>) =>
  async (req) => {
    try {
      const tasks = await service.getTasksByUserIdWithPositionOrder(req.user?.id as number);

      return {
        statusCode: httpStatus.OK,
        body: tasks,
      };
    } catch (err) {
      logger.error({ err }, "GetTasks: something went wrong");
      throw err;
    }
  };

export const makeCreateTask =
  (
    service: TaskServiceType,
  ): ((req: ReqObj<EmptyObj, EmptyObj, CreateTaskReqBody>) => Promise<ResObj>) =>
  async (req) => {
    try {
      const task = await service.createTask(req.body);
      return {
        statusCode: httpStatus.OK,
        body: task,
      };
    } catch (err) {
      logger.error({ err }, "something went wrong");
      throw err;
    }
  };

export const makeUpdateTasksPositions =
  (
    service: TaskServiceType,
  ): ((req: ReqObj<EmptyObj, EmptyObj, OrderUpdateReqBody[]>) => Promise<ResObj>) =>
  async (req) => {
    try {
      await service.updateTaskPosition(req.body, req.user?.id as number);
      return {
        statusCode: httpStatus.OK,
      };
    } catch (err) {
      logger.error({ err }, "updateTasksPositions: something went wrong");
      throw err;
    }
  };
