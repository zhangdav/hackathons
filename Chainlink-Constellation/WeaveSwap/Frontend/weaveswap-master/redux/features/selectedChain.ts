// chainSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
// Define the structure of the chain state
interface SecondChainStateInterface {
  selectedChain: string | null;
}

// Set the initial state for the chain slice
const initialState: SecondChainStateInterface = {
  selectedChain: null,
};

// Create a Redux slice for the chain state
export const selectedChainSlice = createSlice({
  name: "secondChain",
  initialState,

  // Define reducers for updating the chain state
  reducers: {
    // Reducer for setting the active chain
    setSecondChain: (state, action: PayloadAction<string | null>) => {
      // Update the selectedChain state
      state.selectedChain = action.payload;

      // Update local storage based on the active chain
      if (action.payload) {
        // If chain is provided, store it in local storage
        localStorage.setItem("secondChain", JSON.stringify(action.payload));
      } else {
        // If no chain is provided, remove the item from local storage
        localStorage.removeItem("secondChain");
      }
    },
  },
});

// Export the action creators
export const { setSecondChain } = selectedChainSlice.actions;

// Select the active chain from the chain state
export const selectSecondChain = (state: RootState) =>
  state.secondChain.selectedChain;

// Export the chain reducer
export default selectedChainSlice.reducer;
