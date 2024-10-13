
import { configureStore } from "@reduxjs/toolkit";
import responseReducer from "./responseSlice"; 
const store = configureStore({
  reducer: {
    responses: responseReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
