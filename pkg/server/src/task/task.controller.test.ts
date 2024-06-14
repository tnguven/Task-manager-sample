import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import { makeCreateTask, makeGetTasks, makeUpdateTasksPositions } from "./task.controller";
import { TaskServiceType } from "./task.service";
import { EmptyObj, ReqObj, ResObj } from "../types";
import { CreateTaskReqBody, OrderUpdateReqBody } from "./task.model";

const task = {
  id: 1,
  userId: 1,
  title: "title",
  content: "content",
  position: 1,
};
const userId = 1;

describe("Task Controller", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("makeCreateTask happy path", () => {
    const mockCreateTask = vi.fn();
    let createTask: ReturnType<typeof makeCreateTask> = makeCreateTask({
      createTask: mockCreateTask,
    } as unknown as TaskServiceType);
    let result: ResObj;

    beforeEach(async () => {
      mockCreateTask.mockResolvedValue(task);
      result = await createTask({
        body: { userId: 1, content: "content", title: "title" },
      } as ReqObj<EmptyObj, EmptyObj, CreateTaskReqBody>);
    });

    test("must call createTask service", () => {
      expect(mockCreateTask).toBeCalledTimes(1);
      expect(mockCreateTask).toBeCalledWith({ userId, content: "content", title: "title" });
    });

    test("must return new task", () => {
      expect(result).toEqual({
        statusCode: 200,
        body: { id: 1, userId, title: "title", content: "content", position: 1 },
      });
    });
  });

  describe("makeCreateTask unhappy path", () => {
    const mockCreateTask = vi.fn();
    let createTask: ReturnType<typeof makeCreateTask> = makeCreateTask({
      createTask: mockCreateTask,
    } as unknown as TaskServiceType);
    let result: ResObj;

    beforeEach(async () => {
      mockCreateTask.mockRejectedValue("Kaboom");
      result = await createTask({
        body: { userId: 1, content: "content", title: "title" },
      } as ReqObj<EmptyObj, EmptyObj, CreateTaskReqBody>);
    });

    test("must call createTask service", () => {
      expect(mockCreateTask).toBeCalledTimes(1);
      expect(mockCreateTask).toBeCalledWith({ userId: 1, content: "content", title: "title" });
    });

    test("must return 500 status", () => {
      expect(result).toEqual({ statusCode: 500 });
    });
  });

  describe("makeGetTasks happy path", () => {
    const mockGetTasksByUserIdWithPositionOrder = vi.fn();
    let getTasks: ReturnType<typeof makeGetTasks> = makeGetTasks({
      getTasksByUserIdWithPositionOrder: mockGetTasksByUserIdWithPositionOrder,
    } as unknown as TaskServiceType);
    let result: ResObj;

    beforeEach(async () => {
      mockGetTasksByUserIdWithPositionOrder.mockResolvedValue([task]);
      result = await getTasks({ user: { id: 1 } } as ReqObj);
    });

    test("must call getTasksByUserIdWithPositionOrder service", () => {
      expect(mockGetTasksByUserIdWithPositionOrder).toBeCalledTimes(1);
      expect(mockGetTasksByUserIdWithPositionOrder).toBeCalledWith(1);
    });

    test("must return new task", () => {
      expect(result).toEqual({
        statusCode: 200,
        body: [{ id: 1, userId: 1, title: "title", content: "content", position: 1 }],
      });
    });
  });

  describe("makeGetTasks unhappy path", () => {
    const mockGetTasksByUserIdWithPositionOrder = vi.fn();
    let getTasks: ReturnType<typeof makeGetTasks> = makeGetTasks({
      getTasksByUserIdWithPositionOrder: mockGetTasksByUserIdWithPositionOrder,
    } as unknown as TaskServiceType);
    let result: ResObj;

    beforeEach(async () => {
      mockGetTasksByUserIdWithPositionOrder.mockRejectedValue("Kaboom");
      result = await getTasks({ user: { id: userId } } as ReqObj);
    });

    test("must call getTasksByUserIdWithPositionOrder service", () => {
      expect(mockGetTasksByUserIdWithPositionOrder).toBeCalledTimes(1);
      expect(mockGetTasksByUserIdWithPositionOrder).toBeCalledWith(userId);
    });

    test("must return 500 status", () => {
      expect(result).toEqual({
        statusCode: 500,
      });
    });
  });

  describe("makeUpdateTasksPositions happy path", () => {
    const mockUpdateTaskPosition = vi.fn();
    let updateTasksPositions: ReturnType<typeof makeUpdateTasksPositions> =
      makeUpdateTasksPositions({
        updateTaskPosition: mockUpdateTaskPosition,
      } as unknown as TaskServiceType);
    let result: ResObj;

    beforeEach(async () => {
      mockUpdateTaskPosition.mockResolvedValue(null);
      result = await updateTasksPositions({
        body: [{ id: 1, position: 2 }],
        user: { id: userId },
      } as ReqObj<EmptyObj, EmptyObj, OrderUpdateReqBody[]>);
    });

    test("must call updateTaskPosition service", () => {
      expect(mockUpdateTaskPosition).toBeCalledTimes(1);
      expect(mockUpdateTaskPosition).toBeCalledWith([{ id: 1, position: 2 }], userId);
    });

    test("must return 200 status", () => {
      expect(result).toEqual({ statusCode: 200 });
    });
  });

  describe("makeUpdateTasksPositions unhappy path", () => {
    const mockUpdateTaskPosition = vi.fn();
    let updateTasksPositions: ReturnType<typeof makeUpdateTasksPositions> =
      makeUpdateTasksPositions({
        updateTaskPosition: mockUpdateTaskPosition,
      } as unknown as TaskServiceType);
    let result: ResObj;

    beforeEach(async () => {
      mockUpdateTaskPosition.mockRejectedValue(null);
      result = await updateTasksPositions({
        body: [{ id: 1, position: 2 }],
        user: { id: userId },
      } as ReqObj<EmptyObj, EmptyObj, OrderUpdateReqBody[]>);
    });

    test("must call updateTaskPosition service", () => {
      expect(mockUpdateTaskPosition).toBeCalledTimes(1);
      expect(mockUpdateTaskPosition).toBeCalledWith([{ id: 1, position: 2 }], userId);
    });

    test("must return 500 status", () => {
      expect(result).toEqual({ statusCode: 500 });
    });
  });
});
