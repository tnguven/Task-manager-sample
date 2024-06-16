import React, { PropsWithChildren } from "react";
import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";

import type { AppStore, RootState } from "@/lib/store";
import { makeStore } from "@/lib/store";

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
}

export const getStore = (extendedOptions: ExtendedRenderOptions = {}) => {
  const {
    preloadedState = {
      auth: {
        isAuthenticated: false,
        user: null,
        status: "idle",
      },
      task: {
        changedOrder: {},
        originalOrder: {},
        status: "idle",
        tasks: [],
      },
    },
    store = makeStore(preloadedState),
  } = extendedOptions;

  return store;
};

export function renderWithProviders(
  ui?: React.ReactElement,
  { preloadedState, store, ...renderOptions }: ExtendedRenderOptions = {},
) {
  const createdStore = getStore({ preloadedState, store });

  return {
    store,
    ...render(ui, {
      wrapper: ({ children }: PropsWithChildren) => (
        <Provider store={createdStore}>{children}</Provider>
      ),
      ...renderOptions,
    }),
  };
}
