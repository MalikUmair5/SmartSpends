import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { RootState } from '@/store';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const { transactions, totalIncome, totalExpense } = useSelector((state: RootState) => state.transactions);
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const cardColor = useThemeColor({}, 'card');

  // Calculate percentages for income vs expense
  const total = totalIncome + totalExpense;
  const incomePercentage = total > 0 ? (totalIncome / total) * 100 : 0;
  const expensePercentage = total > 0 ? (totalExpense / total) * 100 : 0;

  // Prepare data for category-wise expense breakdown
  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

  // Prepare data for monthly trend
  const monthlyData = transactions.reduce((acc, curr) => {
    const month = new Date(curr.date).toLocaleString('default', { month: 'short' });
    if (!acc[month]) {
      acc[month] = { income: 0, expense: 0 };
    }
    if (curr.type === 'income') {
      acc[month].income += curr.amount;
    } else {
      acc[month].expense += curr.amount;
    }
    return acc;
  }, {} as Record<string, { income: number; expense: number }>);

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title">Analytics</ThemedText>
        </View>

        {/* Income vs Expense Summary */}
        <View style={styles.chartContainer}>
          <ThemedText type="subtitle" style={styles.chartTitle}>Income vs Expense</ThemedText>
          <View style={[styles.summaryContainer, { backgroundColor: cardColor }]}>
            <View style={styles.summaryItem}>
              <ThemedText style={[styles.amount, { color: '#4CAF50' }]}>
                ${totalIncome.toFixed(2)}
              </ThemedText>
              <ThemedText style={styles.label}>Income</ThemedText>
              <ThemedText style={styles.percentage}>{incomePercentage.toFixed(1)}%</ThemedText>
            </View>
            <View style={styles.summaryItem}>
              <ThemedText style={[styles.amount, { color: '#F44336' }]}>
                ${totalExpense.toFixed(2)}
              </ThemedText>
              <ThemedText style={styles.label}>Expense</ThemedText>
              <ThemedText style={styles.percentage}>{expensePercentage.toFixed(1)}%</ThemedText>
            </View>
          </View>
        </View>

        {/* Category-wise Expense Breakdown */}
        <View style={styles.chartContainer}>
          <ThemedText type="subtitle" style={styles.chartTitle}>Expense by Category</ThemedText>
          <View style={[styles.categoryList, { backgroundColor: cardColor }]}>
            {Object.entries(categoryData).map(([category, amount]) => (
              <View key={category} style={[styles.categoryItem, { borderBottomColor: textColor + '20' }]}>
                <ThemedText style={styles.categoryName}>{category}</ThemedText>
                <ThemedText style={[styles.categoryAmount, { color: '#F44336' }]}>
                  ${amount.toFixed(2)}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Monthly Trend */}
        <View style={styles.chartContainer}>
          <ThemedText type="subtitle" style={styles.chartTitle}>Monthly Trend</ThemedText>
          <View style={[styles.monthlyList, { backgroundColor: cardColor }]}>
            {Object.entries(monthlyData).map(([month, data]) => (
              <View key={month} style={[styles.monthlyItem, { borderBottomColor: textColor + '20' }]}>
                <ThemedText style={styles.monthName}>{month}</ThemedText>
                <View style={styles.monthlyAmounts}>
                  <ThemedText style={[styles.monthlyAmount, { color: '#4CAF50' }]}>
                    +${data.income.toFixed(2)}
                  </ThemedText>
                  <ThemedText style={[styles.monthlyAmount, { color: '#F44336' }]}>
                    -${data.expense.toFixed(2)}
                  </ThemedText>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  chartContainer: {
    padding: 20,
    paddingTop: 0,
    marginBottom: 20,
  },
  chartTitle: {
    marginBottom: 15,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 20,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  percentage: {
    fontSize: 14,
    opacity: 0.7,
  },
  categoryList: {
    borderRadius: 12,
    padding: 15,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  categoryName: {
    fontSize: 16,
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  monthlyList: {
    borderRadius: 12,
    padding: 15,
  },
  monthlyItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  monthName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  monthlyAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthlyAmount: {
    fontSize: 14,
  },
});
