import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ResponseState {
  responses: { id: string; text: string }[];
}

const initialState: ResponseState = {
  responses: JSON.parse(localStorage.getItem("responses") || "[]"),
};

const responseSlice = createSlice({
  name: "responses",
  initialState,
  reducers: {
    addResponse(state, action: PayloadAction<{ id: string; text: string }>) {
      state.responses.push(action.payload);
      localStorage.setItem("responses", JSON.stringify(state.responses));
    },
  },
});

export const { addResponse } = responseSlice.actions;

export default responseSlice.reducer;
