import { auth } from "@/src/config/firebase";
import { Colors } from "@/src/theme/colors";
import { Lato_900Black_Italic, useFonts } from "@expo-google-fonts/lato";
import { Button, Input, Text } from "@ui-kitten/components";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Keyboard,
    KeyboardAvoidingView,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from "react-native";

import WaveSvg from "@/src/components/login/WaveSVG";

const LoginScreen = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const animatedValue = useRef(new Animated.Value(0)).current;

    const [fontsLoaded] = useFonts({
        Lato_900Black_Italic,
    });

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" />;
    }

    const handleLogin = async () => {
        setLoading(true);
        try {

            await signInWithEmailAndPassword(auth, email, password);
            router.replace("./home");
        } catch (err: any) {
            console.error("Login error:", err.message);
            setError(err.message);
        }
        setLoading(false);
    };

    const handleInputFocus = () => {
        Animated.timing(animatedValue, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleInputBlur = () => {
        Animated.timing(animatedValue, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const renderEyeIcon = () =>
        passwordVisible ? (
            <Eye
                color="#666666"
                size={24}
                onPress={() => setPasswordVisible(false)}
            />
        ) : (
            <EyeOff
                color="#666666"
                size={24}
                onPress={() => setPasswordVisible(true)}
            />
        );

    const logoTranslateY = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -120],
    });

    return (
        <View style={styles.screenContainer}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Background gradient - now outside SafeAreaView */}
            <LinearGradient
                colors={["#2171ce", "#269de1"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientBackground}
            >
                <WaveSvg animatedValue={animatedValue} isDarker={true} />
                <WaveSvg animatedValue={animatedValue} isDarker={false} />
            </LinearGradient>

            {/* Content area with SafeAreaView */}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                        <View style={styles.container}>
                            <Animated.View
                                style={[
                                    styles.header,
                                    {
                                        transform: [{ translateY: logoTranslateY }]
                                    }
                                ]}
                            >
                                <Text category="h1" style={styles.title}>
                                    flippify
                                </Text>
                            </Animated.View>

                            <View style={styles.spacer} />

                            <Animated.View
                                style={[
                                    styles.content,
                                    {
                                        transform: [{ translateY: logoTranslateY }]
                                    }
                                ]}
                            >
                                {error ? (
                                    <Text status="danger" style={{ marginBottom: 8 }}>
                                        {error}
                                    </Text>
                                ) : null}

                                <Input
                                    placeholder="Email"
                                    value={email}
                                    onChangeText={setEmail}
                                    style={styles.input}
                                    textStyle={styles.inputText}
                                    size="large"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    onFocus={handleInputFocus}
                                    onBlur={handleInputBlur}
                                />
                                <Input
                                    placeholder="Password"
                                    value={password}
                                    onChangeText={setPassword}
                                    style={styles.input}
                                    textStyle={styles.inputText}
                                    size="large"
                                    secureTextEntry={!passwordVisible}
                                    accessoryRight={renderEyeIcon}
                                    onFocus={handleInputFocus}
                                    onBlur={handleInputBlur}
                                />
                                <View style={{ alignItems: "center", marginBottom: 16 }}>
                                    <Text
                                        style={styles.link}
                                        onPress={() =>
                                            Linking.openURL("https://flippify.io/l/reset-password")
                                        }
                                    >
                                        Forgot your password?
                                    </Text>
                                </View>
                                <Button onPress={handleLogin} style={styles.button}>
                                    {loading ? <ActivityIndicator color="white" /> : "Login"}
                                </Button>
                                <View style={styles.links}>
                                    <Text style={styles.linkText}>
                                        Don&apos;t have an account?{" "}
                                    </Text>
                                    <Text
                                        style={styles.link}
                                        onPress={() =>
                                            Linking.openURL("https://flippify.io/l/sign-up")
                                        }
                                    >
                                        Sign up
                                    </Text>
                                </View>
                            </Animated.View>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </View >
    );
};

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
    },
    gradientBackground: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
    },
    container: {
        flex: 1,
        backgroundColor: "transparent",
        padding: 32,
        justifyContent: "flex-start",
    },
    header: {
        alignItems: "center",
        marginBottom: 24,
        zIndex: 1,
        paddingTop: 200,
    },
    spacer: {
        flex: 0.6,
    },
    content: {
        flex: 1,
        justifyContent: "flex-start",
        zIndex: 1,
        paddingTop: 20,
        paddingBottom: 100,
    },
    title: {
        fontFamily: "Lato_900Black_Italic",
        fontSize: 48,
        fontStyle: "italic",
        color: "black",
    },
    subtitle: {
        fontSize: 18,
        marginTop: 4,
        color: Colors.textSecondary,
    },
    links: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 24,
    },
    linkText: {
        fontSize: 16,
        color: Colors.textSecondary,
    },
    link: {
        fontSize: 16,
        color: "dodgerblue",
        marginLeft: 4,
    },
    input: {
        marginBottom: 16,
        backgroundColor: "rgba(239, 239, 239, 0.95)",
        borderRadius: 8,
        borderColor: "transparent",
    },
    inputText: {
        fontSize: 16,
        color: "#333333",
    },
    button: {
        backgroundColor: Colors.buttonBlue,
        marginTop: 8,
        height: 45,
        borderRadius: 10,
        borderWidth: 0,
        borderColor: "transparent",
    },
    bottomLeftSvg: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        transform: [{ scaleX: 1 }],
    },
    bottomRightSvg: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        marginBottom: 25,
        marginRight: 20,
        transform: [{ scaleX: -1 }],
    },
});

export default LoginScreen;