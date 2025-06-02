import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
    resetTransactions: (state) => {
      state.transactions = [];
      state.totalBalance = 0;
      state.totalIncome = 0;
      state.totalExpense = 0;
    },
  },
});

export const { addTransaction, resetTransactions } = transactionsSlice.actions;
export default transactionsSlice.reducer;