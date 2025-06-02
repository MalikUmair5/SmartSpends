import { Colors } from '@/constants/Colors';
import { useThemeManager } from '@/hooks/useThemeManager';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Provider, useDispatch } from 'react-redux';
import { store } from '../store';
import { setUserPreferences } from '../store/slices/userPrefrencesSlice';
import { loadData, STORAGE_KEYS } from '../utils/storage';

function RootLayoutNav() {
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useThemeManager();

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        // Load saved preferences
        const savedPreferences = await loadData(STORAGE_KEYS.USER_PREFERENCES);
        
        if (savedPreferences) {
          // If preferences exist, user has been onboarded
          dispatch(setUserPreferences(savedPreferences));
          // Redirect to main app
          router.replace('/(tabs)');
        } else {
          // If no preferences, user needs onboarding
          router.replace('/(welcome)');
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        // In case of error, show welcome screen
        router.replace('/(welcome)');
      }
    };

    checkOnboarding();
  }, []);

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  // Ensure we have a valid theme value
  const currentTheme = theme || 'light';

  // Create theme object with our custom colors
  const themeObject = {
    ...(currentTheme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(currentTheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      ...Colors[currentTheme],
    },
  };

  return (
    <ThemeProvider value={themeObject}>
      <Stack initialRouteName='(welcome)'>
        <Stack.Screen name="(welcome)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="add-transaction" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={currentTheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}

