import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";

interface HistoryItemProps {
  type: 'income' | 'expense';
  amount: number;
  date: string;
  category: string;
}

export function HistoryItem({ type, amount, date, category }: HistoryItemProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = type === 'income' ? '#4CAF50' : '#F44336';

  // Format date to show "Today", "Yesterday", or the actual date
  const formatDate = (dateStr: string) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const transactionDate = new Date(dateStr);

    if (transactionDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (transactionDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return transactionDate.toLocaleDateString();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.leftContent}>
        <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
          <Ionicons 
            name={type === 'income' ? 'arrow-down' : 'arrow-up'} 
            size={24} 
            color={iconColor} 
          />
        </View>
        <View style={styles.textContainer}>
          <ThemedText type="default" style={styles.category}>{category}</ThemedText>
          <ThemedText type="subtitle" style={[styles.date, { color: useThemeColor({}, 'icon') }]}>
            {formatDate(date)}
          </ThemedText>
        </View>
      </View>
      <ThemedText 
        type="default" 
        style={[styles.amount, { color: iconColor }]}
      >
        {type === 'income' ? '+' : '-'}${Math.abs(amount)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    gap: 4,
  },
  category: {
    fontSize: 16,
    fontWeight: '500',
  },
  date: {
    fontSize: 14,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 