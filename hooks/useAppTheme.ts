import { useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export function useAppTheme() {
  const systemTheme = useColorScheme();
  const userTheme = useSelector((state: RootState) => state.userPreferences.theme);

  // If user selected 'system', use system theme, otherwise use selected theme
  return userTheme === 'system' ? systemTheme : userTheme;
} 