import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import { getTaskIdsAndStatement, makeTaskService } from "./task.service";
import { Pool } from "pg";
import { CreatedTask } from "./task.model";

const taskOrders = [
  { id: 1, position: 1 },
  { id: 2, position: 2 },
  { id: 3, position: 3 },
];
const userId = 1;
const taskId = 2;
const nextPosition = 3;

describe("Task service", () => {
  const mockQuery = vi.fn();
  const mockPoolQuery = vi.fn();
  const mockRelease = vi.fn();
  const mockConnect = vi.fn(() => ({ release: mockRelease, query: mockQuery }));
  const dbPool = {
    connect: mockConnect,
    query: mockPoolQuery,
  } as unknown as Pool;
  const service = makeTaskService({ dbPool });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("createTask happy path", () => {
    const req = { content: "content", title: "title", userId };
    let result: CreatedTask;

    beforeEach(async () => {
      mockQuery
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ rows: [{ id: taskId }] })
        .mockResolvedValueOnce({ rows: [{ max_position: 2 }] })
        .mockResolvedValue(null);
      result = await service.createTask(req);
    });

    test("must call connect", () => {
      expect(mockConnect).toHaveBeenCalledTimes(1);
    });

    test("must start transaction BEGIN", () => {
      expect(mockQuery).toHaveBeenNthCalledWith(1, "BEGIN");
    });

    test("must insert task", () => {
      expect(mockQuery).toHaveBeenNthCalledWith(
        2,
        "INSERT INTO tasks (user_id, title, content) VALUES ($1, $2, $3) RETURNING id",
        [userId, "title", "content"],
      );
    });

    test("must get the next max position", () => {
      expect(mockQuery).toHaveBeenNthCalledWith(
        3,
        "SELECT MAX(position) as max_position FROM task_order WHERE user_id = $1",
        [userId],
      );
    });

    test("must insert task_order", () => {
      expect(mockQuery).toHaveBeenNthCalledWith(
        4,
        "INSERT INTO task_order (user_id, task_id, position) VALUES ($1, $2, $3)",
        [userId, taskId, nextPosition],
      );
    });

    test("must COMMIT transaction", () => {
      expect(mockQuery).toHaveBeenNthCalledWith(5, "COMMIT");
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

  describe("createTask unhappy path", () => {
    const req = { content: "content", title: "title", userId };

    beforeEach(async () => {
      mockQuery.mockRejectedValueOnce(null).mockResolvedValue(null);
      try {
        await service.createTask(req);
      } catch {}
    });

    test("must rollback transaction", () => {
      expect(mockQuery).toHaveBeenNthCalledWith(2, "ROLLBACK");
    });

    test("must release client", () => {
      expect(mockRelease).toHaveBeenCalledOnce();
    });
  });

  describe("updateTaskPosition happy path", () => {
    beforeEach(async () => {
      await service.updateTaskPosition(taskOrders, userId);
    });

    test("must call connect", () => {
      expect(mockPoolQuery).toHaveBeenCalledWith(
        `
          UPDATE task_order
          SET position = CASE task_id
              WHEN 1 THEN 1 WHEN 2 THEN 2 WHEN 3 THEN 3 
          END
          WHERE user_id = $1 AND task_id IN (1, 2, 3)
        `,
        [userId],
      );
    });
  });
});

test("getTaskIdsAndStatement return ids as string and caseStatements as string", () => {
  const { ids, caseStatements } = getTaskIdsAndStatement(taskOrders);
  expect(ids).toBe("1, 2, 3");
  expect(caseStatements).toBe("WHEN 1 THEN 1 WHEN 2 THEN 2 WHEN 3 THEN 3 ");
});
