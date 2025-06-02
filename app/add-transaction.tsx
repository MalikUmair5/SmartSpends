import ThemedInput from '@/components/ThemedInput';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { RootState } from '@/store';
import { addTransaction } from '@/store/slices/transactionsSlice';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const transactionTypes = [
  { label: 'Income', value: 'income' },
  { label: 'Expense', value: 'expense' },
];

const expenseCategories = [
  { label: 'Transport', value: 'transport' },
  { label: 'Food', value: 'food' },
  { label: 'Education', value: 'education' },
  { label: 'Shopping', value: 'shopping' },
];

const incomeCategories = [
  { label: 'Salary', value: 'salary' },
  { label: 'Business', value: 'business' },
  { label: 'Investment', value: 'investment' },
  { label: 'Other', value: 'other' },
];

export default function AddTransactionScreen() {
  const dispatch = useDispatch();
  const { totalBalance } = useSelector((state: RootState) => state.transactions);
  const { initialBalance } = useSelector((state: RootState) => state.userPreferences);
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'icon');
  const textColor = useThemeColor({}, 'text');

  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [category, setCategory] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleAmountChange = (value: string) => {
    setAmount(value);
    setAmountError(''); // Clear error when user types
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setCategoryError(''); // Clear error when user selects
  };

  const validateAmount = () => {
    if (!amount.trim()) {
      setAmountError('Amount is required');
      return false;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      setAmountError('Please enter a valid number');
      return false;
    }

    if (numAmount <= 0) {
      setAmountError('Amount must be greater than 0');
      return false;
    }

    if (type === 'expense' && numAmount > (totalBalance + initialBalance)) {
      setAmountError('Amount cannot be greater than your balance');
      return false;
    }

    return true;
  };

  const validateCategory = () => {
    if (!category) {
      setCategoryError('Please select a category');
      return false;
    }
    return true;
  };

  const handleAddTransaction = () => {
    const isAmountValid = validateAmount();
    const isCategoryValid = validateCategory();

    if (!isAmountValid || !isCategoryValid) return;

    dispatch(addTransaction({
      id: Date.now().toString(),
      type,
      amount: parseFloat(amount),
      category,
      date: date.toISOString(),
      note: notes.trim() || undefined,
    }));

    router.back();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDate(newDate);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ThemedView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={textColor} />
            </TouchableOpacity>
            <ThemedText type="title">Add Transaction</ThemedText>
          </View>

          {/* Transaction Type */}
          <View style={styles.section}>
            <ThemedText type="subtitle">Transaction Type</ThemedText>
            <View style={[styles.typeContainer, { borderColor }]}>
              {transactionTypes.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.typeOption,
                    type === option.value && { backgroundColor: tintColor }
                  ]}
                  onPress={() => setType(option.value as 'income' | 'expense')}
                >
                  <ThemedText style={[
                    styles.typeText,
                    type === option.value && { color: backgroundColor }
                  ]}>
                    {option.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Amount */}
          <View style={styles.section}>
            <ThemedText type="subtitle">Amount</ThemedText>
            <View style={styles.inputContainer}>
              <ThemedInput
                label="Amount"
                placeholder="Amount"
                value={amount}
                onChangeText={handleAmountChange}
                keyboardType="numeric"
                style={[
                  styles.input,
                  amountError && { borderColor: '#F44336' }
                ]}
              />
              {amountError ? (
                <ThemedText style={styles.errorText}>{amountError}</ThemedText>
              ) : null}
            </View>
          </View>

          {/* Category */}
          <View style={styles.section}>
            <ThemedText type="subtitle">Category</ThemedText>
            <View style={[styles.categoryContainer, { borderColor }]}>
              {(type === 'expense' ? expenseCategories : incomeCategories).map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.categoryOption,
                    category === option.value && { backgroundColor: tintColor }
                  ]}
                  onPress={() => handleCategoryChange(option.value)}
                >
                  <ThemedText style={[
                    styles.categoryText,
                    category === option.value && { color: backgroundColor }
                  ]}>
                    {option.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
            {categoryError ? (
              <ThemedText style={styles.errorText}>{categoryError}</ThemedText>
            ) : null}
          </View>

          {/* Date and Time */}
          <View style={styles.section}>
            <ThemedText type="subtitle">Date & Time</ThemedText>
            <View style={styles.dateTimeContainer}>
              <TouchableOpacity 
                style={[styles.dateTimeButton, { borderColor }]}
                onPress={() => setShowDatePicker(true)}
              >
                <ThemedText>{formatDate(date)}</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.dateTimeButton, { borderColor }]}
                onPress={() => setShowTimePicker(true)}
              >
                <ThemedText>{formatTime(date)}</ThemedText>
              </TouchableOpacity>
            </View>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
              />
            )}
            {showTimePicker && (
              <DateTimePicker
                value={date}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onTimeChange}
              />
            )}
          </View>

          {/* Notes */}
          <View style={styles.section}>
            <ThemedText type="subtitle">Notes (Optional)</ThemedText>
            <ThemedInput
              label="Notes"
              placeholder="Add notes"
              value={notes}
              onChangeText={setNotes}
              multiline
              style={[styles.input, styles.notesInput]}
            />
          </View>

          {/* Add Button */}
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: tintColor }]}
            onPress={handleAddTransaction}
          >
            <ThemedText style={[styles.addButtonText, { color: backgroundColor }]}>Add Transaction</ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    marginRight: 15,
  },
  section: {
    marginBottom: 25,
  },
  typeContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
    marginTop: 10,
  },
  typeOption: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  typeText: {
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 5,
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 5,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  categoryOption: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoryText: {
    fontSize: 14,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  dateTimeButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  addButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});