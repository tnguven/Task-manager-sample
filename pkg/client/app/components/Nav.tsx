"use client";

import { useRouter } from "next/navigation";
import { Avatar } from "./avatar/Avatar";
import styles from "../styles/layout.module.css";
import { selectIsAuthenticated, logoutAsync, selectUser } from "@/lib/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export const Nav = () => {
  const Route = useRouter();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  const handleLogout = async () => {
    await dispatch(logoutAsync());
    Route.push("/");
  };

  return (
    <nav className={styles.nav}>
      {isAuthenticated && !!user?.email && (
        <>
          <Avatar name={(user?.email ?? " ").substring(0, 1)} />
          <button className={styles.btn} onClick={handleLogout}>
            Logout
          </button>
        </>
      )}
    </nav>
  );
};
