import {
  saveChangesAsync,
  selectStatus,
  selectTasks,
  Task,
  updateOrderChange,
} from "@/lib/features/task/taskSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useCallback, useEffect, useRef } from "react";

import { TaskItem } from "./Task";

const style = {
  width: 400,
};

export interface Item {
  id: number;
  text: string;
}

export interface ContainerState {
  cards: Item[];
}

export const Tasks = () => {
  const saveChangesRef = useRef<any>(null);
  const status = useAppSelector(selectStatus);
  const tasks = useAppSelector(selectTasks);
  const dispatch = useAppDispatch();

  if (saveChangesRef.current === null) {
    saveChangesRef.current = () => dispatch(saveChangesAsync());
  }

  useEffect(() => {
    if (!saveChangesRef.current !== null) {
      return () => saveChangesRef.current()
    }
  }, []);

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    dispatch(updateOrderChange({ from: dragIndex, to: hoverIndex }));
  }, []);

  const renderCard = useCallback((card: Task, index: number) => {
    return (
      <TaskItem key={card.id} index={index} id={card.id} text={card.content} moveCard={moveCard} />
    );
  }, []);

  return (
    <>
      {status === "loading" && tasks.length > 0 ? (
        <div>loading...</div>
      ) : (
        <div style={style}>{tasks.map((task, i) => renderCard(task, i))}</div>
      )}
    </>
  );
};
