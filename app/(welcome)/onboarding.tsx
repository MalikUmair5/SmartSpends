import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native";
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const slides = [
    {
        id: 1,
        title: "Track Your Expenses",
        description: "Easily log your daily expenses and income with a simple tap",
        image: require("@/assets/images/icon.png") // We'll replace this with proper illustrations
    },
    {
        id: 2,
        title: "Smart Analytics",
        description: "Get detailed insights about your spending habits",
        image: require("@/assets/images/icon.png")
    },
    {
        id: 3,
        title: "Set Budgets",
        description: "Create and manage budgets for different categories",
        image: require("@/assets/images/icon.png")
    }
];


export default function OnboardingScreen() {

    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollRef = useRef(null);

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            scrollRef.current?.scrollTo({
                x: SCREEN_WIDTH * (currentIndex + 1),
                animated: true
            });
        } else {
            // Navigate to initial setup screen
            router.push("/InitialSetup");
        }
    }

    const handleSkip = () => {
        router.push("/InitialSetup");
    };


    return (
        <ThemedView style={styles.container}>
            {/* Skip Button */}
            <ThemedButton 
                style={styles.skipButton}
                onPress={handleSkip}
                textColor="white"
            >
                Skip
            </ThemedButton>

            {/* Slides */}
            <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                    const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                    setCurrentIndex(index);
                }}
            >
                {slides.map((slide) => (
                    <View key={slide.id} style={styles.slide}>
                        <Image source={slide.image} style={styles.image} />
                        <ThemedText type="title" style={styles.title}>
                            {slide.title}
                        </ThemedText>
                        <ThemedText style={styles.description}>
                            {slide.description}
                        </ThemedText>
                    </View>
                ))}
            </ScrollView>

            {/* Pagination Dots */}
            <View style={styles.pagination}>
                {slides.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            currentIndex === index && styles.activeDot
                        ]}
                    />
                ))}
            </View>

            {/* Next Button */}
            <ThemedButton
                style={styles.nextButton}
                onPress={handleNext}
                textColor="white"
            >
                {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
            </ThemedButton>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    skipButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 1,
    },
    slide: {
        width: SCREEN_WIDTH,
        alignItems: 'center',
        padding: 20,
    },
    image: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        paddingHorizontal: 20,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ccc',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#0a7ea4',
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    nextButton: {
        marginHorizontal: 20,
        marginBottom: 30,
    },
});