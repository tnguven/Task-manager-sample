"use client";

import { useRouter } from "next/navigation";
import { selectIsAuthenticated, getUserAsync, selectStatus } from "@/lib/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect } from "react";

export const withAuth = (WrapperComponent: React.ComponentType<any>) => (props: any) => {
  const Router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const status = useAppSelector(selectStatus);

  useEffect(() => {
    // if this can pull user, that will refresh the token
    dispatch(getUserAsync());
  }, []);

  if (!isAuthenticated && status === "failed") {
    Router.push("/");
    return null;
  }

  return <WrapperComponent {...props} />;
};
