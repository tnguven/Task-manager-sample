import type { Task, CreateTaskReqBody, CreatedTask, OrderUpdateReqBody } from "./task.model";

import { Pool } from "pg";
import { logger } from "../logger";

export type TaskServiceType = ReturnType<typeof makeTaskService>;

export const getTaskIdsAndStatement = (taskOrders: OrderUpdateReqBody[]) =>
  taskOrders.reduce(
    (state, { id, position }) => {
      state.ids = `${state.ids ? `${state.ids}, ` : ""}${id}`;
      state.caseStatements = `${state.caseStatements ? `${state.caseStatements} ` : ""}WHEN id = ${id} THEN ${position}`;
      return state;
    },
    { ids: "", caseStatements: "" } as {
      ids: string;
      caseStatements: string;
    },
  );

export const makeTaskService = ({ dbPool }: { dbPool: Pool }) => ({
  async createTask({ content, title, userId }: CreateTaskReqBody): Promise<CreatedTask> {
    const orderResult = await dbPool.query(
      "SELECT MAX(position) as max_position FROM tasks WHERE user_id = $1;",
      [userId],
    );
    const nextPosition = (orderResult.rows[0]?.max_position ?? 0) + 1;

    const { rows } = await dbPool.query<Task>(
      "INSERT INTO tasks (user_id, title, content, position, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
      [userId, title, content, nextPosition, new Date().toISOString()],
    );
    const result = rows[0];

    return {
      id: result.id,
      userId,
      title: result.title,
      content: result.content,
      position: result.position,
    };
  },

  async getTasksByUserIdWithPositionOrder(userId: number) {
    const { rows } = await dbPool.query<Task>(
      `
        SELECT id, title, content, created_at, position 
        FROM tasks
        WHERE user_id = $1
        ORDER BY position ASC;
      `,
      [userId],
    );
    return rows;
  },

  async updateTaskPosition(taskOrders: OrderUpdateReqBody[], userId: number) {
    const client = await dbPool.connect();

    try {
      await client.query("BEGIN");

      await Promise.all(
        taskOrders.map(({ id, position }) =>
          client.query("UPDATE tasks SET position = $1 WHERE user_id = $2 AND id = $3", [
            position,
            userId,
            id,
          ]),
        ),
      );

      await client.query("COMMIT");
    } catch (err) {
      logger.error({ err }, "updateTaskPosition: update task position transaction error occur");
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },
});
