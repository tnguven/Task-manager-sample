import supertest from "supertest";
import { server } from "../src/server";

export const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImlhdCI6MTcxODM5NTI1MiwiZXhwIjo1MzE4Mzk1MjUyfQ.7LRXPu6GXi_O-LZ9zfZSf1dyHfY-mpR6CnQkIcotTlw";

export const requestWithCookie = (
  url: string,
  method: "get" | "post" | "delete" | "put",
  cookie: string[],
) =>
  supertest(server)
    [method](url)
    .set("Content-Type", "application/json")
    .set("Cookie", cookie);
export const request = (url: string, method: "get" | "post" | "delete" | "put") =>
  supertest(server)[method](url).set("Content-Type", "application/json");
