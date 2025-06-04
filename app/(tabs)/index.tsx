import { HistoryItem } from "@/components/HistoryItem";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { RootState } from "@/store";
import { getCurrencySymbol } from "@/utils/currency";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

interface ThemedTextProps {
  style?: any;
  type?: string;
  children?: React.ReactNode;
}

// Card component for balance and stats
const Card = ({ children, style }: { children: React.ReactNode; style?: any }) => {
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'icon');
  const cardBgColor = useThemeColor({}, 'background') === '#fff' ? '#151718' : '#fff';
  const textColor = cardBgColor === '#fff' ? '#151718' : '#fff';

  return (
    <View style={[styles.card, { backgroundColor: cardBgColor, borderColor }, style]}>
      {React.Children.map(children, child => {
        if (React.isValidElement<ThemedTextProps>(child)) {
          return React.cloneElement(child, {
            style: { ...child.props.style, color: textColor }
          });
        }
        return child;
      })}
    </View>
  );
};

export default function HomeScreen() {
  const { name, initialBalance, currency } = useSelector((state: RootState) => state.userPreferences);
  const { transactions, totalBalance, totalIncome, totalExpense } = useSelector(
    (state: RootState) => state.transactions
  );

  const currencySymbol = getCurrencySymbol(currency);

  return (
    <ThemedView style={styles.container}>
      {/* Fixed Top Section */}
      <View style={styles.topSection}>
        {/* Greeting */}
        <ThemedText type="title" style={styles.greeting}>
          Hi, {name}
        </ThemedText>

        {/* Balance Card */}
        <Card style={styles.balanceCard}>
          <ThemedText type="subtitle">Total Balance</ThemedText>
          <ThemedText type="title" style={styles.balanceAmount}>
            {currencySymbol}{totalBalance + initialBalance}
          </ThemedText>
        </Card>

        {/* Income/Expense Cards */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <ThemedText type="subtitle">Income</ThemedText>
            <ThemedText type="default" style={styles.incomeAmount}>
              +{currencySymbol}{totalIncome}
            </ThemedText>
          </Card>
          <Card style={styles.statCard}>
            <ThemedText type="subtitle">Expenses</ThemedText>
            <ThemedText type="default" style={styles.expenseAmount}>
              -{currencySymbol}{totalExpense}
            </ThemedText>
          </Card>
        </View>
      </View>

      {/* Scrollable Transactions Section */}
      <View style={styles.transactionsSection}>
        <ThemedText type="title" style={styles.sectionTitle}>
          Recent Transactions
        </ThemedText>
        
        <ScrollView style={styles.transactionsScroll}>
          {transactions.map((transaction, index) => (
            <HistoryItem
              key={index}
              type={transaction.type}
              amount={transaction.amount}
              date={transaction.date}
              category={transaction.category}
            />
          ))}
        </ScrollView>
      </View>

      {/* Add Transaction Button */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => router.push('/add-transaction' as any)}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    padding: 20,
    paddingBottom: 0,
  },
  greeting: {
    marginTop: 20,
    marginBottom: 20,
  },
  card: {
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
  },
  balanceCard: {
    marginBottom: 20,
  },
  balanceAmount: {
    fontSize: 32,
    marginTop: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    padding: 15,
  },
  incomeAmount: {
    fontSize: 20,
    marginTop: 5,
  },
  expenseAmount: {
    fontSize: 20,
    marginTop: 5,
  },
  transactionsSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    marginBottom: 15,
  },
  transactionsScroll: {
    flex: 1,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a7ea4',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
