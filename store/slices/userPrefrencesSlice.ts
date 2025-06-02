import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserPreferencesState {
  name: string;
  initialBalance: number;
  currency: 'USD' | 'PKR';
  theme: 'light' | 'dark' | 'system';
}

const initialState: UserPreferencesState = {
  name: '',
  initialBalance: 0,
  currency: 'PKR',
  theme: 'system',
};

const userPreferencesSlice = createSlice({
  name: 'userPreferences',
  initialState,
  reducers: {
    setUserPreferences: (state, action: PayloadAction<Partial<UserPreferencesState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setUserPreferences } = userPreferencesSlice.actions;
export default userPreferencesSlice.reducer;