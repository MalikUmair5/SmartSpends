import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { View, Text, Image, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function WelcomeScreen() {
    let handleGetStarted = () => { 
        router.push("/onboarding")
    }


    return (
        <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
                <ThemedText type="title" style={styles.title}>Welcome</ThemedText>
                <Image source={require("@/assets/images/icon.png")} style={styles.icon} />
                <ThemedText type="defaultSemiBold" style={styles.title}>Track your Finances Effortlessly</ThemedText>
                <ThemedText  type="description" style={{ textAlign: 'center', marginBottom: 20 }}>Stay on top of your finances by keeping a track of you income and expanses</ThemedText>
            </View>
            <View style={{ width: '100%' }}>
                <ThemedButton type="full-width" onPress={handleGetStarted}>Get Started</ThemedButton>
            </View>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    icon: {
        width: 150,
        height: 150,
        marginBottom: 20
    },
    title: {
        marginBottom: 20
    },

})