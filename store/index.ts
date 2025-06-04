import { configureStore } from '@reduxjs/toolkit';
import transactionsReducer, { transactionsMiddleware } from './slices/transactionsSlice';
import userPreferencesReducer, { userPreferencesMiddleware } from './slices/userPrefrencesSlice';

export const store = configureStore({
  reducer: {
    userPreferences: userPreferencesReducer,
    transactions: transactionsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userPreferencesMiddleware, transactionsMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;