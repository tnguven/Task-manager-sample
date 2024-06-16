"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { selectStatus, selectUser } from "@/lib/features/auth/authSlice";
import { useAppSelector } from "@/lib/hooks";
import { z } from "zod";
import { useEffect } from "react";

export type Inputs = {
  email: string;
  password: string;
};

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const useAuthForm = (action: (data: Inputs) => Promise<void>) => {
  const status = useAppSelector(selectStatus);
  const user = useAppSelector(selectUser);

  const form = useForm<Inputs>({ resolver: zodResolver(schema) });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await action(data);
  };

  useEffect(() => {
    // reset inputs if successfully submit
    if (status === "idle" && user) {
      form.reset();
    }
  }, [user, status]);

  return <const>[form, onSubmit];
};
