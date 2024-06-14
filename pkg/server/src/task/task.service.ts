import type { Task, CreateTaskReqBody, CreatedTask, OrderUpdateReqBody } from "./task.model";

import { Pool } from "pg";

export type TaskServiceType = ReturnType<typeof makeTaskService>;

// TODO: test it
export const getTaskIdsAndStatement = (taskOrders: OrderUpdateReqBody[]) =>
  taskOrders.reduce(
    (state, { id, position }) => {
      state.ids = `${state.ids ? `${state.ids}, ` : ""}${id}`;
      state.caseStatements = `${state.caseStatements}WHEN ${id} THEN ${position} `;
      return state;
    },
    { ids: "", caseStatements: "" } as {
      ids: string;
      caseStatements: string;
    },
  );

export const makeTaskService = ({ dbPool }: { dbPool: Pool }) => ({
  async createTask({ content, title, userId }: CreateTaskReqBody): Promise<CreatedTask> {
    const dbClient = await dbPool.connect();

    try {
      await dbClient.query("BEGIN");
      const taskResult = await dbClient.query(
        "INSERT INTO tasks (user_id, title, content) VALUES ($1, $2, $3) RETURNING id",
        [userId, title, content],
      );
      const [{ id: taskId }] = taskResult.rows;

      const orderResult = await dbClient.query(
        "SELECT MAX(position) as max_position FROM task_order WHERE user_id = $1",
        [userId],
      );
      const nextPosition = (orderResult.rows[0].max_position ?? 0) + 1;

      await dbClient.query(
        "INSERT INTO task_order (user_id, task_id, position) VALUES ($1, $2, $3)",
        [userId, taskId, nextPosition],
      );
      await dbClient.query("COMMIT");

      return {
        id: taskId,
        userId,
        title,
        content,
        position: nextPosition,
      };
    } catch (err) {
      console.error(err);
      await dbClient.query("ROLLBACK");
      throw err;
    } finally {
      dbClient.release();
    }
  },

  async getTasksByUserIdWithPositionOrder(userId: number) {
    try {
      const { rows } = await dbPool.query<Task>(
        `
            SELECT t.id, t.title, t.content, t.created_at, o.position 
            FROM tasks t
            JOIN task_order o ON t.id = o.task_id
            WHERE o.user_id = $1
            ORDER BY o.position ASC`,
        [userId],
      );
      return rows;
    } catch (err) {
      console.error("Can not fetch tasks: ", err);
      throw err;
    }
  },

  async updateTaskPosition(taskOrders: OrderUpdateReqBody[], userId: number) {
    const { ids, caseStatements } = getTaskIdsAndStatement(taskOrders);

    await dbPool.query(
      `
          UPDATE task_order
          SET position = CASE task_id
              ${caseStatements}
          END
          WHERE user_id = $1 AND task_id IN (${ids})
      `,
      [userId],
    );
  },
});
