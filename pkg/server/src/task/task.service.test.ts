import { describe, expect, test, vi, beforeEach, beforeAll, afterAll, afterEach } from "vitest";
import { getTaskIdsAndStatement, makeTaskService } from "./task.service";
import { Pool } from "pg";
import { CreatedTask } from "./task.model";

const taskOrders = [
  { id: 1, position: 2 },
  { id: 2, position: 3 },
  { id: 3, position: 1 },
];
const userId = 1;
const taskId = 2;
const nextPosition = 3;

const now = new Date("2024-06-18T14:59:25.451Z").toISOString();

describe("Task service", () => {
  const mockQuery = vi.fn();
  const dbPool = {
    query: mockQuery,
  } as unknown as Pool;
  const service = makeTaskService({ dbPool });

  beforeAll(() => {
    vi.setSystemTime(now);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("createTask happy path", () => {
    const req = { content: "content", title: "title", userId };
    let result: CreatedTask;

    beforeEach(async () => {
      mockQuery
        .mockResolvedValueOnce({ rows: [{ max_position: 2 }] })
        .mockResolvedValueOnce({
          rows: [{ id: taskId, position: nextPosition, title: "title", content: "content" }],
        })
        .mockResolvedValue(null);
      result = await service.createTask(req);
    });

    test("must get the next max position", () => {
      expect(mockQuery).toHaveBeenNthCalledWith(
        1,
        "SELECT MAX(position) as max_position FROM tasks WHERE user_id = $1;",
        [userId],
      );
    });

    test("must insert task", () => {
      expect(mockQuery).toHaveBeenNthCalledWith(
        2,
        "INSERT INTO tasks (user_id, title, content, position, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
        [userId, "title", "content", nextPosition, now.toString()],
      );
    });

    test("must return task with latest position", () => {
      expect(result).toEqual({
        id: 2,
        userId: 1,
        content: "content",
        position: 3,
        title: "title",
      });
    });
  });

  describe("updateTaskPosition happy path", () => {
    beforeEach(async () => {
      await service.updateTaskPosition(taskOrders, userId);
    });

    //test("must call connect", () => {
    //  expect(mockQuery).toHaveBeenCalledWith(
    //    `
    //      UPDATE tasks
    //      SET position = CASE
    //        WHEN id = 1 THEN 2 WHEN id = 2 THEN 3 WHEN id = 3 THEN 1
    //        ELSE position
    //      END
    //      WHERE user_id = $1 AND id IN (1, 2, 3);
    //    `,
    //    [userId],
    //  );
    //});
  });
});

test("getTaskIdsAndStatement return ids as string and caseStatements as string", () => {
  const { ids, caseStatements } = getTaskIdsAndStatement(taskOrders);
  expect(ids).toBe("1, 2, 3");
  expect(caseStatements).toBe("WHEN id = 1 THEN 2 WHEN id = 2 THEN 3 WHEN id = 3 THEN 1");
});
