"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/app/components/form/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginAsync, selectStatus } from "@/lib/features/auth/authSlice";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { z } from "zod";

type Inputs = {
  email: string;
  password: string;
};

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({ resolver: zodResolver(schema) });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await dispatch(loginAsync(data));
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("email", { required: true })}
        label="Email"
        placeholder="example@test.com"
        type="email"
        id="email"
      />
      {errors.email?.message && <span>Email is required</span>}

      <Input
        {...register("password", { required: true, minLength: 6 })}
        label="Password"
        placeholder="***"
        type="password"
        id="password"
      />
      {errors.password?.message && <span>Password is required</span>}

      <Input type="submit" disabled={status === "loading"} value="Login" />
    </form>
  );
};
