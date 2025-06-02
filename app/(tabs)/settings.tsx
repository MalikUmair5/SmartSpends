import ThemedInput from '@/components/ThemedInput';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { RootState } from '@/store';
import { resetTransactions } from '@/store/slices/transactionsSlice';
import { setUserPreferences } from '@/store/slices/userPrefrencesSlice';
import { saveData, STORAGE_KEYS } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const themeOptions = [
  { label: 'Light', value: 'light', icon: 'sunny' },
  { label: 'Dark', value: 'dark', icon: 'moon' },
  { label: 'System', value: 'system', icon: 'phone-portrait' },
];

export default function SettingsScreen() {
  const dispatch = useDispatch();
  const { name, initialBalance, theme } = useSelector((state: RootState) => state.userPreferences);
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const innerBorderColor = useThemeColor({}, 'background') === '#fff' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [newName, setNewName] = useState(name);
  const [newBalance, setNewBalance] = useState(initialBalance.toString());

  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
    dispatch(setUserPreferences({ theme: newTheme }));
    await saveData(STORAGE_KEYS.USER_PREFERENCES, { theme: newTheme });
  };

  const handleNameSave = async () => {
    if (!newName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    dispatch(setUserPreferences({ name: newName.trim() }));
    await saveData(STORAGE_KEYS.USER_PREFERENCES, { name: newName.trim() });
    setIsEditingName(false);
  };

  const handleBalanceSave = async () => {
    const balance = parseFloat(newBalance);
    if (isNaN(balance)) {
      Alert.alert('Error', 'Please enter a valid number');
      return;
    }
    dispatch(setUserPreferences({ initialBalance: balance }));
    await saveData(STORAGE_KEYS.USER_PREFERENCES, { initialBalance: balance });
    setIsEditingBalance(false);
  };

  const handleReset = async () => {
    try {
      // Clear stored data
      await saveData(STORAGE_KEYS.USER_PREFERENCES, null);
      await saveData(STORAGE_KEYS.TRANSACTIONS, null);
      
      // Reset Redux state
      dispatch(setUserPreferences({
        name: '',
        initialBalance: 0,
        theme: 'system',
        currency: 'USD'
      }));
      dispatch(resetTransactions());
      
      // Show confirmation
      Alert.alert(
        'Reset Complete',
        'Your data has been cleared. You will be redirected to the welcome screen.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(welcome)')
          }
        ]
      );
    } catch (error) {
      console.error('Error resetting data:', error);
      Alert.alert('Error', 'Failed to reset data. Please try again.');
    }
  };

  const renderNameSection = () => {
    if (isEditingName) {
      return (
        <View style={styles.editContainer}>
          <ThemedInput
            label="Name"
            value={newName}
            onChangeText={setNewName}
            placeholder="Enter your name"
            style={styles.input}
          />
          <View style={styles.editButtons}>
            <TouchableOpacity
              style={[styles.editButton, { borderColor }]}
              onPress={() => setIsEditingName(false)}
            >
              <ThemedText>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.editButton, { backgroundColor: tintColor }]}
              onPress={handleNameSave}
            >
              <ThemedText style={{ color: '#fff' }}>Save</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={[styles.settingItem, { borderBottomColor: innerBorderColor }]}
        onPress={() => setIsEditingName(true)}
      >
        <View style={styles.settingInfo}>
          <ThemedText type="subtitle">Name</ThemedText>
          <ThemedText>{name}</ThemedText>
        </View>
        <Ionicons name="chevron-forward" size={24} color={textColor} />
      </TouchableOpacity>
    );
  };

  const renderBalanceSection = () => {
    if (isEditingBalance) {
      return (
        <View style={styles.editContainer}>
          <ThemedInput
            label="Initial Balance"
            value={newBalance}
            onChangeText={setNewBalance}
            placeholder="Enter initial balance"
            keyboardType="numeric"
            style={styles.input}
          />
          <View style={styles.editButtons}>
            <TouchableOpacity
              style={[styles.editButton, { borderColor }]}
              onPress={() => setIsEditingBalance(false)}
            >
              <ThemedText>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.editButton, { backgroundColor: tintColor }]}
              onPress={handleBalanceSave}
            >
              <ThemedText style={{ color: '#fff' }}>Save</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={[styles.settingItem, { borderBottomColor: innerBorderColor }]}
        onPress={() => setIsEditingBalance(true)}
      >
        <View style={styles.settingInfo}>
          <ThemedText type="subtitle">Initial Balance</ThemedText>
          <ThemedText>${initialBalance}</ThemedText>
        </View>
        <Ionicons name="chevron-forward" size={24} color={textColor} />
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Section */}
        <View style={styles.section}>
          <ThemedText type="title" style={styles.sectionTitle}>
            Profile
          </ThemedText>
          
          <View style={[styles.card, { backgroundColor, borderColor }]}>
            <View style={[styles.settingItem, { borderBottomColor: innerBorderColor }]}>
              {renderNameSection()}
            </View>
            <View style={[styles.settingItem, { borderBottomColor: innerBorderColor }]}>
              {renderBalanceSection()}
            </View>
          </View>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <ThemedText type="title" style={styles.sectionTitle}>
            Appearance
          </ThemedText>
          
          <View style={[styles.card, { backgroundColor, borderColor }]}>
            {themeOptions.map((option, index) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.themeOption,
                  theme === option.value && styles.selectedTheme,
                  { borderBottomColor: innerBorderColor },
                  index === themeOptions.length - 1 && { borderBottomWidth: 0 }
                ]}
                onPress={() => handleThemeChange(option.value as 'light' | 'dark' | 'system')}
              >
                <Ionicons 
                  name={option.icon as any} 
                  size={24} 
                  color={textColor} 
                />
                <ThemedText type="default" style={styles.themeLabel}>
                  {option.label}
                </ThemedText>
                {theme === option.value && (
                  <Ionicons 
                    name="checkmark-circle" 
                    size={24} 
                    color={tintColor} 
                    style={styles.checkmark}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <ThemedText type="title" style={styles.sectionTitle}>
            About
          </ThemedText>
          
          <View style={[styles.card, { backgroundColor, borderColor }]}>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <ThemedText type="subtitle">Version</ThemedText>
                <ThemedText>1.0.0</ThemedText>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Danger Zone Section */}
        <View style={styles.section}>
          <ThemedText type="title" style={[styles.sectionTitle, { color: '#ff3b30' }]}>
            Danger Zone
          </ThemedText>
          
          <View style={[styles.card, { backgroundColor, borderColor }]}>
            <TouchableOpacity 
              style={[styles.settingItem, styles.dangerItem]} 
              onPress={handleReset}
            >
              <View style={styles.settingInfo}>
                <ThemedText type="subtitle" style={{ color: '#ff3b30' }}>Reset App</ThemedText>
                <ThemedText style={{ color: '#ff3b30' }}>Clear all data and return to welcome screen</ThemedText>
              </View>
              <Ionicons name="trash-outline" size={24} color="#ff3b30" />
            </TouchableOpacity>
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
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    marginBottom: 15,
  },
  card: {
    borderRadius: 15,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flex: 1,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
  },
  selectedTheme: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  themeLabel: {
    marginLeft: 15,
    flex: 1,
  },
  checkmark: {
    marginLeft: 10,
  },
  editContainer: {
    padding: 15,
    borderBottomWidth: 1,
  },
  input: {
    marginBottom: 10,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  dangerItem: {
    borderBottomWidth: 0,
  },
});
