import type { TaskServiceType } from "./task.service";
import type { EmptyObj, ReqObj, ResObj } from "../types";
import type { CreateTaskReqBody, OrderUpdateReqBody } from "./task.model";

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
      return {
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      };
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
      console.error(err);
      return {
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      };
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
    } catch {
      return {
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  };
