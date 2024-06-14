"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/app/components/form/Input";
import { selectStatus, addTaskAsync } from "@/lib/features/task/taskSlice";
import { selectUser } from "@/lib/features/auth/authSlice";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import styles from "./AddTaskForm.module.css";

type Inputs = {
  task: string;
};

export const AddTaskForm = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const status = useAppSelector(selectStatus);
  const {
    register,
    handleSubmit,
    reset,
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await dispatch(addTaskAsync({
      content: data.task,
      title: data.task.substring(0, 10),
      userId: user?.id ?? ""
    }));
    reset();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <Input
        disabled={status === "loading"}
        {...register("task")}
        placeholder="add new task"
        type="text"
      />
    </form>
  );
};
