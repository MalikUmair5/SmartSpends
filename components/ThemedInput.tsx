import { StyleSheet, TextInput, TextInputProps } from "react-native";
import { View, Text } from "react-native";
import { ThemedText } from "./ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

interface InputProps extends TextInputProps {
    label: string;
}


export default function ThemedInput({ label, ...props }: InputProps) {

    const color = useThemeColor({}, 'text')


    return (
        <View style={{ width: '100%' }}>
            <ThemedText  type="default">{label}</ThemedText>
            <TextInput style={[style.Input, {borderBottomColor: color, color}]} {...props} />
        </View>
    )
}


const style = StyleSheet.create({
    Input: {
        borderStyle: "solid",
        width: "100%", color: 'black',
        borderBottomWidth: 5,
        borderTopWidth: 1,
        borderRightWidth: 5,
        borderLeftWidth: 1,
        fontSize: 16,
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        marginTop: 0,
        marginBottom: 10
    }
})


