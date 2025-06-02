import { HistoryItem } from '@/components/HistoryItem';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { RootState } from '@/store';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

type FilterType = 'all' | 'income' | 'expense';

export default function HistoryScreen() {
  const { transactions } = useSelector((state: RootState) => state.transactions);
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');
  const [filter, setFilter] = useState<FilterType>('all');

  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, typeof transactions>);

  // Filter transactions based on selected filter
  const filteredGroups = Object.entries(groupedTransactions).reduce((acc, [date, transactions]) => {
    const filtered = transactions.filter(t => 
      filter === 'all' || t.type === filter
    );
    if (filtered.length > 0) {
      acc[date] = filtered;
    }
    return acc;
  }, {} as Record<string, typeof transactions>);

  // Sort dates in descending order
  const sortedDates = Object.keys(filteredGroups).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="title">History</ThemedText>
      </View>

      {/* Filter Buttons */}
      <View style={[styles.filterContainer, { borderColor }]}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'all' && { backgroundColor: tintColor }
          ]}
          onPress={() => setFilter('all')}
        >
          <ThemedText style={[
            styles.filterText,
            filter === 'all' && { color: backgroundColor }
          ]}>
            All
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'income' && { backgroundColor: tintColor }
          ]}
          onPress={() => setFilter('income')}
        >
          <ThemedText style={[
            styles.filterText,
            filter === 'income' && { color: backgroundColor }
          ]}>
            Income
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'expense' && { backgroundColor: tintColor }
          ]}
          onPress={() => setFilter('expense')}
        >
          <ThemedText style={[
            styles.filterText,
            filter === 'expense' && { color: backgroundColor }
          ]}>
            Expense
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Transactions List */}
      <ScrollView style={styles.scrollView}>
        {sortedDates.map((date) => (
          <View key={date} style={styles.dateGroup}>
            <ThemedText type="subtitle" style={styles.dateHeader}>
              {new Date(date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </ThemedText>
            <View style={styles.transactionsList}>
              {filteredGroups[date].map((transaction, index) => (
                <HistoryItem
                  key={transaction.id}
                  type={transaction.type}
                  amount={transaction.amount}
                  date={transaction.date}
                  category={transaction.category}
                />
              ))}
            </View>
          </View>
        ))}

        {sortedDates.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color={useThemeColor({}, 'icon')} />
            <ThemedText type="subtitle" style={styles.emptyStateText}>
              No transactions found
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 0,
    gap: 10,
  },
  filterButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  dateGroup: {
    marginBottom: 20,
  },
  dateHeader: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  transactionsList: {
    paddingHorizontal: 20,
    gap: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 40,
  },
  emptyStateText: {
    marginTop: 10,
  },
});
