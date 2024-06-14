export type Task = {
  id: number;
  user_id: number;
  title: string;
  content: string;
  created_at?: Date;
  position: number;
};

export type CreateTaskReqBody = {
  userId: number;
  title: string;
  content: string;
};

export type CreatedTask = CreateTaskReqBody & {
  id: number;
  userId: number;
  position: number;
};

export type OrderUpdateReqBody = { id: number; position: number };
