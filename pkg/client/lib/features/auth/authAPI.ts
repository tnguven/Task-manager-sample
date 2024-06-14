import type { User } from "./authSlice";
import { config } from "@/lib/config";

export const fetchLogin = async (email: string, password: string) => {
  const response = await fetch(`${config.api}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const result: User = await response.json();
  return result;
};

export const fetchLogout = async () => {
  const response = await fetch(`${config.api}/user/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  const result: User = await response.json();
  return result;
};

export const signIn = async (email: string, password: string) => {
  const response = await fetch(`${config.api}/user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const result: User = await response.json();
  return result;
};

export const fetchUser = async () => {
  const response = await fetch(`${config.api}/user`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const result: User = await response.json();
  return result;
};
