"use client";

import { forwardRef } from "react";
import styles from "./Input.module.css";

type InputProps = React.HTMLProps<HTMLInputElement> & {
  label?: string;
  errorMsg?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function FInput(
  { label, errorMsg, ...otherProps },
  ref,
) {
  return (
    <>
      <div className={styles.wrap}>
        {label ? (
          <label className={styles.label} htmlFor={otherProps.id}>
            {label}
          </label>
        ) : null}

        <input className={styles.input} ref={ref} {...otherProps} />
      </div>
      {errorMsg && <span className={styles.error}>{errorMsg}</span>}
    </>
  );
});
