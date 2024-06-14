import { createAppSlice } from "@/lib/createAppSlice";
import { fetchUser, fetchLogin, signIn, fetchLogout } from "./authAPI";

export type User = {
  id: string;
  email: string;
  created_at: Date;
};

export interface AuthSliceState {
  isAuthenticated: boolean;
  user: User | null;
  status: "idle" | "loading" | "failed";
}

const initialState: AuthSliceState = {
  isAuthenticated: false,
  user: null,
  status: "idle",
};

export const authSlice = createAppSlice({
  name: "auth",
  initialState,
  reducers: (create) => ({
    singInAsync: create.asyncThunk(
      async ({ email, password }: { email: string; password: string }) => {
        const user = await signIn(email, password);
        return user;
      },
      {
        pending: (state) => {
          state.status = "loading";
        },
        fulfilled: (state, action) => {
          state.status = "idle";
          state.user = action.payload;
          state.isAuthenticated = true;
        },
        rejected: (state) => {
          state.status = "failed";
          state.isAuthenticated = false;
        },
      },
    ),
    loginAsync: create.asyncThunk(
      async ({ email, password }: { email: string; password: string }) => {
        const user = await fetchLogin(email, password);
        return user;
      },
      {
        pending: (state) => {
          state.status = "loading";
        },
        fulfilled: (state, action) => {
          state.status = "idle";
          state.user = action.payload;
          state.isAuthenticated = true;
        },
        rejected: (state) => {
          state.status = "failed";
          state.isAuthenticated = false;
        },
      },
    ),
    getUserAsync: create.asyncThunk(
      async () => {
        const user = await fetchUser();
        return user;
      },
      {
        pending: (state) => {
          state.status = "loading";
        },
        fulfilled: (state, action) => {
          state.status = "idle";
          state.user = action.payload;
          state.isAuthenticated = true;
        },
        rejected: (state) => {
          state.status = "failed";
          state.isAuthenticated = false;
        },
      },
    ),
    logoutAsync: create.asyncThunk(
      async () => {
        await fetchLogout();
        return null;
      },
      {
        pending: (state) => {
          state.status = "loading";
        },
        fulfilled: (state) => {
          state.isAuthenticated = initialState.isAuthenticated;
          state.user = initialState.user;
          state.status = initialState.status;
        },
        rejected: (state) => {
          state.status = "failed";
        },
      },
    ),
  }),
  selectors: {
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectUser: (state) => state.user,
    selectStatus: (state) => state.status,
  },
});

export const { loginAsync, getUserAsync, singInAsync, logoutAsync } = authSlice.actions;
export const { selectUser, selectStatus, selectIsAuthenticated } = authSlice.selectors;
