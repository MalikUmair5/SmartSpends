import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const STORAGE_KEY = '@transactions';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  note?: string;
  date: string;
}

interface TransactionsState {
  transactions: Transaction[];
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
}

const initialState: TransactionsState = {
  transactions: [],
  totalBalance: 0,
  totalIncome: 0,
  totalExpense: 0,
};

// Load initial state from AsyncStorage
export const loadTransactions = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : initialState;
  } catch (error) {
    console.error('Error loading transactions:', error);
    return initialState;
  }
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.push(action.payload);
      // Update totals
      state.totalBalance = state.transactions.reduce((acc, curr) => {
        return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
      }, 0);
      state.totalIncome = state.transactions
        .filter(t => t.type === 'income')
        .reduce((acc, curr) => acc + curr.amount, 0);
      state.totalExpense = state.transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => acc + curr.amount, 0);
    },
    setTransactions: (state, action: PayloadAction<TransactionsState>) => {
      return action.payload;
    },
    resetTransactions: () => initialState,
  },
});

// Middleware to handle AsyncStorage operations
export const transactionsMiddleware = (store: any) => (next: any) => async (action: any) => {
  const result = next(action);
  
  if (action.type === 'transactions/addTransaction' || 
      action.type === 'transactions/resetTransactions' ||
      action.type === 'transactions/setTransactions') {
    try {
      const state = store.getState().transactions;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  }
  
  return result;
};

export const { addTransaction, resetTransactions, setTransactions } = transactionsSlice.actions;
export default transactionsSlice.reducer;