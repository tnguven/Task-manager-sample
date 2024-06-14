import { describe, test, vi, expect, afterAll, beforeEach, afterEach, beforeAll } from "vitest";
import { dbPool } from "../src/db/connect";

import httpStatus from "http-status";
import { requestWithCookie, request } from "./tool";

const email = "test@test.com";
const password = "secret1";

describe("user route: /v1/user", () => {
  const routePath = "/v1/user";

  beforeAll(async () => {
    await dbPool.query("TRUNCATE users CASCADE;");
  });

  afterAll(async () => {
    await dbPool.end();
  });

  describe.sequential("ENDPOINT: /v1/user", () => {
    describe.sequential("Signup new user", () => {
      let headers: Record<string, string>;

      test("POST: Signup user", async () => {
        const response = await request(routePath, "post")
          .send({ email, password })
          .expect(httpStatus.CREATED);

        const body = response.body;
        headers = response.header;

        expect(body.id).toBeDefined();
        expect(body.email).toBeDefined();
        expect(body.created_at).toBeDefined();
      });

      test("GET: Get authenticated user", async () => {
        const response = await requestWithCookie(
          routePath,
          "get",
          headers["set-cookie"] as unknown as string[],
        ).expect(httpStatus.OK);

        const body = response.body;
        headers = response.header;

        expect(body.id).toBeDefined();
        expect(body.email).toBeDefined();
        expect(body.created_at).toBeDefined();
      });
    });

    describe.sequential("Login and logout user", () => {
      let headers: Record<string, string>;

      test("POST: Login user with email password", async () => {
        const response = await request(`${routePath}/login`, "post")
          .send({ email, password })
          .expect(httpStatus.OK);

        const body = response.body;
        headers = response.header;

        expect(body.id).toBeDefined();
        expect(body.email).toBeDefined();
        expect(body.created_at).toBeDefined();
      });

      test("POST: Logout user", async () => {
        await requestWithCookie(
          `${routePath}/logout`,
          "post",
          headers["set-cookie"] as unknown as string[],
        ).expect(httpStatus.OK);
      });
    });

    describe.sequential("Delete user", () => {
      let headers: Record<string, string>;

      beforeEach(async () => {
        const response = await request(`${routePath}/login`, "post")
          .send({ email, password })
          .expect(httpStatus.OK);

        headers = response.header;
      });

      test("DELETE: User", async () => {
        await requestWithCookie(
          routePath,
          "delete",
          headers["set-cookie"] as unknown as string[],
        ).expect(httpStatus.NO_CONTENT);
      });
    });
  });
});
