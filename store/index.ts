import { configureStore } from '@reduxjs/toolkit';
import transactionsReducer from './slices/transactionsSlice';
import userPreferencesReducer from './slices/userPrefrencesSlice';

export const store = configureStore({
  reducer: {
    userPreferences: userPreferencesReducer,
    transactions: transactionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;