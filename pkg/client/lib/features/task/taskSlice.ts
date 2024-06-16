import { createAppSlice } from "@/lib/createAppSlice";
import { fetchTasks, addTask, putOrderChanges } from "./taskApi";
import { PayloadAction } from "@reduxjs/toolkit";
import update from "immutability-helper";

export type Task = {
  id: string;
  title: string;
  content: string;
  position: number;
  created_at: Date;
};

export type NewTask = {
  userId: string;
  title: Task["title"];
  content: Task["content"];
};

export interface TaskSliceState {
  tasks: Task[];
  changedOrder: Record<string, number>;
  originalOrder: Record<string, number>;
  status: "idle" | "loading" | "failed";
}

const initialState: TaskSliceState = {
  changedOrder: {},
  originalOrder: {},
  tasks: [],
  status: "idle",
};

export const taskSlice = createAppSlice({
  name: "task",
  initialState,
  reducers: (create) => ({
    updateOrderChange: create.reducer(
      (state, action: PayloadAction<{ from: number; to: number }>) => {
        const { payload } = action;
        const changedOrder = state.tasks.reduce(
          (changed, task, i) => {
            if (i === payload.to) {
              changed[task.id] = payload.from + 1;
            } else if (i === payload.from) {
              changed[task.id] = payload.to + 1;
            }
            return changed;
          },
          {} as TaskSliceState["changedOrder"],
        );
        state.changedOrder = {
          ...state.changedOrder,
          ...changedOrder,
        };
        state.tasks = update(state.tasks, {
          $splice: [
            [payload.from, 1],
            [payload.to, 0, state.tasks[payload.from] as Task],
          ],
        });
      },
    ),
    addTaskAsync: create.asyncThunk(
      async (newTask: NewTask) => {
        const task = await addTask(newTask);
        return task;
      },
      {
        pending: (state) => {
          state.status = "loading";
        },
        fulfilled: (state, action) => {
          state.status = "idle";
          state.tasks = [...state.tasks, action.payload];
          state.originalOrder = {
            ...state.originalOrder,
            [action.payload.id]: action.payload.position,
          };
        },
        rejected: (state) => {
          state.status = "failed";
        },
      },
    ),
    getTasksAsync: create.asyncThunk(
      async () => {
        const tasks = await fetchTasks();
        return tasks;
      },
      {
        pending: (state) => {
          state.status = "loading";
        },
        fulfilled: (state, action) => {
          state.status = "idle";
          state.tasks = action.payload;
          state.originalOrder = (action.payload ?? [])?.reduce(
            (orderMap, task) => {
              orderMap[task.id] = task.position;
              return orderMap;
            },
            {} as TaskSliceState["originalOrder"],
          );
        },
        rejected: (state) => {
          state.status = "failed";
        },
      },
    ),
    saveChangesAsync: create.asyncThunk(
      async (_arg, { getState }) => {
        const { task } = getState() as { task: TaskSliceState };
        
        if (Object.keys(task.changedOrder).length > 0) {
          const orderChanges = Object.entries(task.changedOrder).map(([id, position]) => ({
            id,
            position,
          }));
          const tasks = await putOrderChanges(orderChanges);
          return tasks;
        }

        return [];
      },
      {
        fulfilled: (state) => {
          state.changedOrder = initialState.changedOrder;
        },
        rejected: () => {
          console.error("Can not save the task order changes");
        },
      },
    ),
  }),
  selectors: {
    selectChangeOrder: (state) => state.changedOrder,
    selectTasks: (state) => state.tasks,
    selectStatus: (state) => state.status,
  },
});

export const { updateOrderChange, addTaskAsync, getTasksAsync, saveChangesAsync } =
  taskSlice.actions;
export const { selectTasks, selectStatus, selectChangeOrder } = taskSlice.selectors;
