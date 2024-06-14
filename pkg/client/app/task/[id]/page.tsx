"use client";

import { withAuth } from "@/lib/hoc/withAuth";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getTasksAsync, selectTasks } from "@/lib/features/task/taskSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import styles from "../../styles/taskDetail.module.css";

function TaskDetailPage({ params }: { params: { id: string } }) {
  const Route = useRouter();
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectTasks);
  const task = tasks.find(({ id }) => id === params.id);
  const time = task?.created_at ? new Date(task.created_at) : new Date();

  useEffect(() => {
    dispatch(getTasksAsync());
  }, []);

  return task ? (
    <section className={styles.taskDetail}>
      <button className={styles.btn} onClick={() => Route.push("/task")}>
        Back
      </button>
      <h1 className={styles.h1}>
        {task?.title}
        <pre
          className={styles.pre}
        >{`${time.getDate()}-${time.getMonth()}-${time.getFullYear()} | ${time.getHours()}:${time.getMinutes()}`}</pre>
      </h1>
      <p className={styles.content}>{task?.content}</p>
    </section>
  ) : null;
}

export default withAuth(TaskDetailPage);
