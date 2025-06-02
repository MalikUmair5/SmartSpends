import { useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export function useThemeManager() {
  const systemTheme = useColorScheme();
  const userTheme = useSelector((state: RootState) => state.userPreferences.theme);

  // Ensure we have valid theme values
  const validSystemTheme = systemTheme || 'light';
  const validUserTheme = userTheme || 'system';

  console.log('Theme Debug:', {
    systemTheme: validSystemTheme,
    userTheme: validUserTheme,
    finalTheme: validUserTheme === 'system' ? validSystemTheme : validUserTheme
  });

  // If user selected 'system', use system theme, otherwise use selected theme
  return validUserTheme === 'system' ? validSystemTheme : validUserTheme;
} 