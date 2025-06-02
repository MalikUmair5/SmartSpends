import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import { ThemedText } from "./ThemedText";

interface InputProps extends TextInputProps {
    label: string;
}

export default function ThemedInput({ label, placeholderTextColor, style, ...props }: InputProps) {
    const textColor = useThemeColor({}, 'text');
    const placeholderColor = useThemeColor({}, 'icon');

    return (
        <View style={{ width: '100%' }}>
            <ThemedText type="default">{label}</ThemedText>
            <TextInput 
                style={[
                    styles.input, 
                    { 
                        borderBottomColor: textColor,
                        color: textColor,
                        backgroundColor: 'transparent'
                    },
                    style
                ]} 
                placeholderTextColor={placeholderColor}
                {...props} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        borderStyle: "solid",
        width: "100%",
        borderBottomWidth: 5,
        borderTopWidth: 1,
        borderRightWidth: 5,
        borderLeftWidth: 1,
        fontSize: 16,
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        marginTop: 0,
        marginBottom: 10,
        paddingHorizontal: 8,
        paddingVertical: 4
    }
});


