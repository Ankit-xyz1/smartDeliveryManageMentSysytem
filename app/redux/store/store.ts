import { configureStore } from "@reduxjs/toolkit";
import partnersReducer from "../slice/allPartnersSLice";
import ordersReducer from "../slice/allOrdersSlice";
import assigmentsReducer from "../slice/allAssignmentSlice";

export const store = configureStore({
  reducer: {
    partners: partnersReducer,
    orders: ordersReducer,
    assigments: assigmentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
