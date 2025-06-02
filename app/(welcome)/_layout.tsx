import { Stack } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function WelcomeLayout() {
    const colorScheme = useColorScheme();

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: 'Welcome Home',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="onboarding"
                options={{
                    title: 'Onboarding',
                    headerShown: false,
                }}
            />
                <Stack.Screen
                name="InitialSetup"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
}
