"use client";

import { Input } from "@/app/components/form/Input";
import { singInAsync, selectStatus } from "@/lib/features/auth/authSlice";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { useAuthForm } from "@/lib/hooks/form-hook";

export const SignInForm = () => {
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
    await dispatch(singInAsync(data));
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("email", { required: true })}
        label="Email"
        placeholder="example@test.com"
        type="email"
        errorMsg={errors.email?.message}
      />
      <Input
        {...register("password", { required: true, minLength: 6 })}
        label="Password"
        placeholder="***"
        type="password"
        errorMsg={errors.password?.message}
      />

      <Input type="submit" disabled={status === "loading"} value="Sign in" />
    </form>
  );
};
