"use client";

import { Input } from "@/app/components/form/Input";
import { loginAsync, selectStatus } from "@/lib/features/auth/authSlice";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { useAuthForm } from "@/lib/hooks/form-hook";

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);

  const [
    {
      register,
      handleSubmit,
      formState: { errors },
    },
    onSubmit,
  ] = useAuthForm(async (data) => {
    await dispatch(loginAsync(data));
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("email", { required: true })}
        label="Email"
        placeholder="example@test.com"
        type="email"
        id="email"
        errorMsg={errors.email?.message}
      />
      <Input
        {...register("password", { required: true, minLength: 6 })}
        label="Password"
        placeholder="***"
        type="password"
        id="password"
        errorMsg={errors.password?.message}
      />

      <Input type="submit" disabled={status === "loading"} value="Login" />
    </form>
  );
};
