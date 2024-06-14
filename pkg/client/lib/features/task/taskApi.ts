import type { Task, NewTask } from "./taskSlice";
import { config } from "@/lib/config";

export const fetchTasks = async () => {
  const response = await fetch(`${config.api}/task`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const result: Task[] = await response.json();
  return result;
};

export const addTask = async (newTask: NewTask) => {
  const response = await fetch(`${config.api}/task`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTask),
  });
  const result: Task = await response.json();
  return result;
};

export const putOrderChanges = async (orderChanges: { id: string; position: number }[]) => {
  const response = await fetch(`${config.api}/task`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderChanges),
  });
  const result: Task = await response.json();
  return result;
};
