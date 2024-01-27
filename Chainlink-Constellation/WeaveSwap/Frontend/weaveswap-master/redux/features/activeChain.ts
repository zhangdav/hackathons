import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { ChainType } from "@/types/chainType";

// Define the structure of the chain state
interface ChainState {
  activeChain: ChainType | null;
}

// Set the initial state for the chain slice
const initialState: ChainState = {
  activeChain: null,
};

// Create a Redux slice for the chain state
export const chainSlice = createSlice({
  name: "chain",
  initialState,

  // Define reducers for updating the chain state
  reducers: {
    // Reducer for setting the active chain
    setActiveChain: (state, action: PayloadAction<ChainType | null>) => {
      // Update the activeChain state
      state.activeChain = action.payload;
    },
  },
});

// Export the action creators
export const { setActiveChain } = chainSlice.actions;

// Select the active chain from the chain state
export const selectActiveChain = (state: RootState) => state.chain.activeChain;

// Export the chain reducer
export default chainSlice.reducer;
