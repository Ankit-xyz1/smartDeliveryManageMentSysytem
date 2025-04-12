import { configureStore } from '@reduxjs/toolkit';
import partnersReducer  from '../slice/allPartnersSLice';


export const store = configureStore({
  reducer: {
    partners:partnersReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
