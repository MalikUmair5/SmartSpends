import { ThemedButton } from "@/components/ThemedButton"
import ThemedInput from "@/components/ThemedInput"
import ThemedMultiSelectInput from "@/components/ThemedMultiSelectInput"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { useColorScheme } from "@/hooks/useColorScheme"
import { setUserPreferences } from '@/store/slices/userPrefrencesSlice'
import { router } from "expo-router"
import { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { useDispatch } from 'react-redux'

const currencyOptions = [
    { label: "USD ($)", value: "USD" },
    { label: "PKR (₨)", value: "PKR" }
];

const themeOptions = [
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
    { label: "System", value: "system" }
];

export default function InitialSetupScreen() {
    const dispatch = useDispatch();
    const systemTheme = useColorScheme();
    const [name, setName] = useState("");
    const [initialBalance, setInitialBalance] = useState("");
    const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);
    const [selectedTheme, setSelectedTheme] = useState<string[]>([systemTheme ?? 'light']);
    
    // Error states
    const [nameError, setNameError] = useState("");
    const [balanceError, setBalanceError] = useState("");
    const [currencyError, setCurrencyError] = useState("");

    // Update theme when selection changes
    useEffect(() => {
        if (selectedTheme.length > 0) {
            const newTheme = selectedTheme[0] as 'light' | 'dark' | 'system';
            console.log('Theme selected:', newTheme);
            dispatch(setUserPreferences({ theme: newTheme }));
        }
    }, [selectedTheme]);

    const validateForm = () => {
        let isValid = true;

        // Validate name
        if (!name.trim()) {
            setNameError("Name is required");
            isValid = false;
        } else {
            setNameError("");
        }

        // Validate balance
        const balance = parseFloat(initialBalance);
        if (isNaN(balance) || balance < 0) {
            setBalanceError("Please enter a valid positive number");
            isValid = false;
        } else {
            setBalanceError("");
        }

        // Validate currency
        if (selectedCurrencies.length === 0) {
            setCurrencyError("Please select a currency");
            isValid = false;
        } else {
            setCurrencyError("");
        }

        return isValid;
    };

    const handleFinish = () => {
        if (!validateForm()) {
            return;
        }

        // Prepare user preferences
        const userPreferences = {
            name: name.trim(),
            initialBalance: Number(initialBalance),
            currency: selectedCurrencies[0] as 'USD' | 'PKR',
            theme: selectedTheme[0] as 'light' | 'dark' | 'system',
        };

        console.log('Saving preferences:', userPreferences);

        // Save to Redux store (AsyncStorage is handled by middleware)
        dispatch(setUserPreferences(userPreferences));

        // Navigate to main app
        router.replace("/(tabs)");
    };

    return (
        <ThemedView style={styles.container}>
            <View style={styles.formContainer}>
                <ThemedText type="title" style={styles.title}>Just a few things needed!</ThemedText>

                <View>
                    <ThemedInput
                        label="Name"
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            setNameError(""); // Clear error when typing
                        }}
                        placeholder="Enter your name"
                        style={nameError ? { borderColor: '#F44336' } : undefined}
                    />
                    {nameError ? (
                        <ThemedText style={styles.errorText}>{nameError}</ThemedText>
                    ) : null}
                </View>

                <View>
                    <ThemedInput
                        label="Initial Balance"
                        value={initialBalance}
                        onChangeText={(text) => {
                            setInitialBalance(text);
                            setBalanceError(""); // Clear error when typing
                        }}
                        keyboardType="numeric"
                        placeholder="Enter initial balance"
                        style={balanceError ? { borderColor: '#F44336' } : undefined}
                    />
                    {balanceError ? (
                        <ThemedText style={styles.errorText}>{balanceError}</ThemedText>
                    ) : null}
                </View>

                <View>
                    <ThemedMultiSelectInput
                        label="Preferred Currencies"
                        options={currencyOptions}
                        selectedValues={selectedCurrencies}
                        onSelectionChange={(values) => {
                            setSelectedCurrencies(values);
                            setCurrencyError(""); // Clear error when selecting
                        }}
                        singleSelect
                    />
                    {currencyError ? (
                        <ThemedText style={styles.errorText}>{currencyError}</ThemedText>
                    ) : null}
                </View>

                <ThemedMultiSelectInput
                    label="Theme Preference"
                    options={themeOptions}
                    selectedValues={selectedTheme}
                    onSelectionChange={setSelectedTheme}
                    singleSelect
                />

            </View>
            <View style={styles.buttonContainer}>
                <ThemedButton
                    type="full-width"
                    onPress={handleFinish}
                >
                    Finish Setup
                </ThemedButton>
            </View>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between'
    },
    title: {
        marginTop: 20,
        marginBottom: 9,
        textAlign: 'center',
    },
    formContainer: {
        gap: 16,
    },
    buttonContainer: {
        marginTop: 8,
    },
    errorText: {
        color: '#F44336',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    }
});
