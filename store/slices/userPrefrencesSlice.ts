import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const STORAGE_KEY = '@user_preferences';

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

// Load initial state from AsyncStorage
export const loadUserPreferences = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : initialState;
  } catch (error) {
    console.error('Error loading user preferences:', error);
    return initialState;
  }
};

const userPreferencesSlice = createSlice({
  name: 'userPreferences',
  initialState,
  reducers: {
    setUserPreferences: (state, action: PayloadAction<Partial<UserPreferencesState>>) => {
      return { ...state, ...action.payload };
    },
    resetUserPreferences: () => initialState,
  },
});

// Middleware to handle AsyncStorage operations
export const userPreferencesMiddleware = (store: any) => (next: any) => async (action: any) => {
  const result = next(action);
  
  if (action.type === 'userPreferences/setUserPreferences' || 
      action.type === 'userPreferences/resetUserPreferences') {
    try {
      const state = store.getState().userPreferences;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  }
  
  return result;
};

export const { setUserPreferences, resetUserPreferences } = userPreferencesSlice.actions;
export default userPreferencesSlice.reducer;