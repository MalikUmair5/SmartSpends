import { ThemedButton } from "@/components/ThemedButton"
import ThemedInput from "@/components/ThemedInput"
import ThemedMultiSelectInput from "@/components/ThemedMultiSelectInput"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { useColorScheme } from "@/hooks/useColorScheme"
import { router } from "expo-router"
import { useState } from "react"
import { StyleSheet, View } from "react-native"

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
    const [name, setName] = useState("");
    const [initialBalance, setInitialBalance] = useState("");
    const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);
    const [selectedTheme, setSelectedTheme] = useState<string[]>([useColorScheme() ?? 'light']);

    const handleFinish = () => {
        // TODO: Save user preferences
        router.replace("/(tabs)");
    };

    return (
        <ThemedView style={styles.container}>
            <View style={styles.formContainer}>
                <ThemedText type="title" style={styles.title}>Just a few things needed!</ThemedText>

                <ThemedInput
                    label="Name"
                    value={name}
                    onChangeText={setName}
                />

                <ThemedInput
                    label="Initial Balance"
                    value={initialBalance}
                    onChangeText={setInitialBalance}
                    keyboardType="numeric"
                />

                <ThemedMultiSelectInput
                    label="Preferred Currencies"
                    options={currencyOptions}
                    selectedValues={selectedCurrencies}
                    onSelectionChange={setSelectedCurrencies}
                    singleSelect
                />

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
    }
});
