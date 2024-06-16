import { vi, test, describe, expect, beforeEach, beforeAll } from "vitest";
import { getStore } from "@/utils/test-utils";
import {
  loginAsync,
  singInAsync,
  getUserAsync,
  logoutAsync,
  selectIsAuthenticated,
  selectStatus,
  selectUser,
} from "./authSlice";

describe("authSlice", () => {
  const email = "test@example.com";
  const password = "password";
  const created_at = new Date().toISOString();
  const user = { id: "1", email, created_at };
  let store: any;

  const mockJson = vi.fn();
  const mockFetch = vi.fn().mockImplementation(
    vi.fn().mockResolvedValue({
      json: mockJson,
    }),
  );

  beforeAll(() => {
    global.fetch = mockFetch;
  });

  beforeEach(() => {
    store = getStore();
  });

  describe("actions", () => {
    test("should handle singInAsync.fulfilled", async () => {
      mockJson.mockResolvedValue({ id: "1", email, created_at });
      expect(store.getState().auth.user).toBe(null);
      expect(store.getState().auth.status).toBe("idle");
      expect(store.getState().auth.isAuthenticated).toBe(false);
      const promise = store.dispatch(singInAsync({ email, password }) as any);
      expect(store.getState().auth.status).toBe("loading");
      await promise;
      expect(store.getState().auth.user).toEqual({ id: "1", email, created_at });
      expect(store.getState().auth.status).toBe("idle");
      expect(store.getState().auth.isAuthenticated).toBe(true);
    });

    test("should handle singInAsync.rejected", async () => {
      const email = "test@example.com";
      const password = "password";
      mockJson.mockRejectedValue(null);
      expect(store.getState().auth.user).toBe(null);
      expect(store.getState().auth.status).toBe("idle");
      expect(store.getState().auth.isAuthenticated).toBe(false);
      const promise = store.dispatch(singInAsync({ email, password }) as any);
      expect(store.getState().auth.status).toBe("loading");
      await promise;
      expect(store.getState().auth.user).toBe(null);
      expect(store.getState().auth.status).toBe("failed");
      expect(store.getState().auth.isAuthenticated).toBe(false);
    });

    test("should handle loginAsync.fulfilled", async () => {
      mockJson.mockResolvedValue(user);
      expect(store.getState().auth.user).toBe(null);
      expect(store.getState().auth.status).toBe("idle");
      expect(store.getState().auth.isAuthenticated).toBe(false);
      const promise = store.dispatch(loginAsync({ email, password }) as any);
      expect(store.getState().auth.status).toBe("loading");
      await promise;
      expect(store.getState().auth.user).toEqual(user);
      expect(store.getState().auth.status).toBe("idle");
      expect(store.getState().auth.isAuthenticated).toBe(true);
    });

    test("should handle loginAsync.rejected", async () => {
      const email = "test@example.com";
      const password = "password";
      mockJson.mockRejectedValue(null);
      expect(store.getState().auth.user).toBe(null);
      expect(store.getState().auth.status).toBe("idle");
      expect(store.getState().auth.isAuthenticated).toBe(false);
      const promise = store.dispatch(loginAsync({ email, password }) as any);
      expect(store.getState().auth.status).toBe("loading");
      await promise;
      expect(store.getState().auth.user).toEqual(null);
      expect(store.getState().auth.status).toBe("failed");
      expect(store.getState().auth.isAuthenticated).toBe(false);
    });

    test("should handle getUserAsync.fulfilled", async () => {
      mockJson.mockResolvedValue(user);
      expect(store.getState().auth.user).toBe(null);
      expect(store.getState().auth.status).toBe("idle");
      expect(store.getState().auth.isAuthenticated).toBe(false);
      const promise = store.dispatch(getUserAsync() as any);
      expect(store.getState().auth.status).toBe("loading");
      await promise;
      expect(store.getState().auth.user).toEqual(user);
      expect(store.getState().auth.status).toBe("idle");
      expect(store.getState().auth.isAuthenticated).toBe(true);
    });

    test("should handle getUserAsync.rejected", async () => {
      mockJson.mockRejectedValue(null);
      expect(store.getState().auth.user).toBe(null);
      expect(store.getState().auth.status).toBe("idle");
      expect(store.getState().auth.isAuthenticated).toBe(false);
      const promise = store.dispatch(getUserAsync() as any);
      expect(store.getState().auth.status).toBe("loading");
      await promise;
      expect(store.getState().auth.user).toEqual(null);
      expect(store.getState().auth.status).toBe("failed");
      expect(store.getState().auth.isAuthenticated).toBe(false);
    });

    test("should handle logoutAsync.fulfilled", async () => {
      mockJson.mockResolvedValueOnce(user).mockResolvedValueOnce(null);
      await store.dispatch(loginAsync({ email, password }) as any);
      expect(store.getState().auth.user).toEqual(user);
      expect(store.getState().auth.status).toBe("idle");
      expect(store.getState().auth.isAuthenticated).toBe(true);

      const promise = store.dispatch(logoutAsync() as any);
      expect(store.getState().auth.status).toBe("loading");
      await promise;
      expect(store.getState().auth.user).toEqual(null);
      expect(store.getState().auth.status).toBe("idle");
      expect(store.getState().auth.isAuthenticated).toBe(false);
    });

    test("should handle logoutAsync.rejected", async () => {
      mockJson.mockResolvedValueOnce(user).mockRejectedValue(null);
      await store.dispatch(loginAsync({ email, password }) as any);
      expect(store.getState().auth.user).toEqual(user);
      expect(store.getState().auth.status).toBe("idle");
      expect(store.getState().auth.isAuthenticated).toBe(true);

      const promise = store.dispatch(logoutAsync() as any);
      expect(store.getState().auth.status).toBe("loading");
      await promise;
      expect(store.getState().auth.user).toEqual(user);
      expect(store.getState().auth.status).toBe("failed");
      expect(store.getState().auth.isAuthenticated).toBe(true);
    });
  });

  describe("selectors", () => {
    test("should select isAuthenticated", () => {
      const state = <const>{ auth: { isAuthenticated: true, user: null, status: "idle" } };
      expect(selectIsAuthenticated(state)).toBe(true);
    });

    test("should select user", () => {
      const user = <const>{ id: "1", email: "test@example.com", created_at: new Date() };
      const state = <const>{ auth: { isAuthenticated: true, user, status: "idle" } };
      expect(selectUser(state)).toEqual(user);
    });

    test("should select status", () => {
      const state = <const>{ auth: { isAuthenticated: false, user: null, status: "loading" } };
      expect(selectStatus(state)).toBe("loading");
    });
  });
});
