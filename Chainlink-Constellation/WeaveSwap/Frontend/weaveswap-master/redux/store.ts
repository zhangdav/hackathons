import { configureStore } from "@reduxjs/toolkit";
import chainSlice from "./features/activeChain";
import selectedChainSlice from "./features/selectedChain";

export const store = configureStore({
  reducer: {
    chain: chainSlice,
    secondChain: selectedChainSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
