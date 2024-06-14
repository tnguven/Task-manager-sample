"use client";

import styles from "./Avatar.module.css";

export const Avatar = ({ name }: { name: string }) => {
  return <div className={styles.container}>{name.toUpperCase()}</div>;
};
