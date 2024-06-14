import { dbPool } from "../db/connect";
import { makeGetTasks, makeCreateTask, makeUpdateTasksPositions } from "./task.controller";
import { makeTaskService } from "./task.service";

const service = makeTaskService({ dbPool });

export const getTasks = makeGetTasks(service);
export const createTask = makeCreateTask(service);
export const updateTasksPositions = makeUpdateTasksPositions(service);
