import type { Action, ThunkAction } from "@reduxjs/toolkit";

import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./features/auth/authSlice";
import { taskSlice } from "./features/task/taskSlice";

const rootReducer = combineSlices(authSlice, taskSlice);

export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    devTools: true,
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
