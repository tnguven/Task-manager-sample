"use client";

import { withAuth } from "@/lib/hoc/withAuth";
import { getTasksAsync } from "@/lib/features/task/taskSlice";
import { useAppDispatch } from "@/lib/hooks";
import { AddTaskForm } from "@/app/components/form/AddTaskForm";

import { Tasks } from "@/app/components/task/Tasks";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useEffect } from "react";

function TaskPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getTasksAsync());
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <h1>Tasks</h1>
      <AddTaskForm />
      <Tasks />
    </DndProvider>
  );
}

export default withAuth(TaskPage);
