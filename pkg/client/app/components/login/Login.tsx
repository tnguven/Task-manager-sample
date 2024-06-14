"use client";

import { useState } from "react";
import { LoginForm } from "@/app/components/form/LoginForm";
import { SignInForm } from "@/app/components/form/SinginForm";
import styles from "./Login.module.css";

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <section>
      <div className={styles.btnBlock}>
        <button
          className={[styles.btn, isLogin && styles.active].filter(Boolean).join(" ")}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={[styles.btn, !isLogin && styles.active].filter(Boolean).join(" ")}
          onClick={() => setIsLogin(false)}
        >
          Sign in
        </button>
      </div>
      {isLogin ? <LoginForm /> : <SignInForm />}
    </section>
  );
};
