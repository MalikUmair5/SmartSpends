import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./ThemedText";

type CurrencyOption = {
    label: string;
    value: string;
};

type ThemedMultiSelectInputProps = {
    label: string;
    options: CurrencyOption[];
    selectedValues: string[];
    onSelectionChange: (values: string[]) => void;
    singleSelect?: boolean;
};

export default function ThemedMultiSelectInput({
    label,
    options,
    selectedValues,
    onSelectionChange,
    singleSelect = false,
}: ThemedMultiSelectInputProps) {
    const backgroundColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');

    const toggleSelection = (value: string) => {
        if (singleSelect) {
            onSelectionChange([value]);
        } else {
            if (selectedValues.includes(value)) {
                onSelectionChange(selectedValues.filter(v => v !== value));
            } else {
                onSelectionChange([...selectedValues, value]);
            }
        }
    };

    return (
        <View style={styles.container}>
            <ThemedText style={styles.label}>{label}</ThemedText>
            <View style={styles.optionsContainer}>
                {options.map((option) => (
                    <TouchableOpacity
                        key={option.value}
                        style={[
                            styles.option,
                            {
                                backgroundColor: selectedValues.includes(option.value)
                                    ? textColor
                                    : backgroundColor,
                                borderColor: textColor,
                            },
                        ]}
                        onPress={() => toggleSelection(option.value)}
                    >
                        <ThemedText
                            style={[
                                styles.optionText,
                                {
                                    color: selectedValues.includes(option.value)
                                        ? backgroundColor
                                        : textColor,
                                },
                            ]}
                        >
                            {option.label}
                        </ThemedText>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        marginBottom: 8,
        fontSize: 16,
        fontWeight: '500',
    },
    optionsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    option: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        minWidth: 100,
        alignItems: 'center',
    },
    optionText: {
        fontSize: 14,
        fontWeight: '500',
    },
}); 