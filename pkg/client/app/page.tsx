"use client";

import { getUserAsync, selectIsAuthenticated } from "@/lib/features/auth/authSlice";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { Login } from "./components/login/Login";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function IndexPage() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const Router = useRouter();

  useEffect(() => {
    dispatch(getUserAsync());
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      Router.push("/task");
    }
  }, [isAuthenticated]);

  return (
    <>
      <Login />
    </>
  );
}
