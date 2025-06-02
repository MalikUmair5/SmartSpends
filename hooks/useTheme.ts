// hooks/useTheme.ts
import { useColorScheme as useNativeColorScheme } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export function useTheme() {
  const systemTheme = useNativeColorScheme();
  const userTheme = useSelector((state: RootState) => state.userPreferences.theme);

  // If user selected 'system', use system theme, otherwise use selected theme
  const theme = userTheme === 'system' ? systemTheme : userTheme;

  return theme;
}