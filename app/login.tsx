import { auth } from '@/src/config/firebase';
import { Colors } from '@/src/theme/colors';
import { Lato_900Black_Italic, useFonts } from '@expo-google-fonts/lato';
import { Button, Input, Layout, Text } from '@ui-kitten/components';
import { Stack, useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Linking, Platform, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

const LoginScreen = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState('');

    const [fontsLoaded] = useFonts({
        Lato_900Black_Italic,
    });

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" />
    }

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.replace("./home")
        } catch (err: any) {
            console.error('Login error:', err.message);
            setError(err.message);
        }
    };


    const renderEyeIcon = () =>
        passwordVisible ? (
            <Eye color={Colors.houseBlue} size={24} onPress={() => setPasswordVisible(false)} />
        ) : (
            <EyeOff color={Colors.houseBlue} size={24} onPress={() => setPasswordVisible(true)} />
        );

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <KeyboardAvoidingView
                style={{ flex: 1, backgroundColor: Colors.background }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                        <Layout style={styles.container}>
                            <View style={styles.header}>
                                <Text category="h1" style={styles.title}>
                                    flippify
                                </Text>
                            </View>

                            {error ? (
                                <Text status="danger" style={{ marginBottom: 8 }}>
                                    {error}
                                </Text>
                            ) : null}

                            <View style={styles.content}>
                                <Input
                                    label={() => (
                                        <Text category="label" style={{ color: Colors.textSecondary, fontSize: 14 }}>
                                            Email
                                        </Text>
                                    )}
                                    placeholder="Enter your email"
                                    value={email}
                                    onChangeText={setEmail}
                                    style={styles.input}
                                    textStyle={{ fontSize: 16 }}
                                    size="large"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                                <Input
                                    label={() => (
                                        <Text category="label" style={{ color: Colors.textSecondary, fontSize: 14 }}>
                                            Password
                                        </Text>
                                    )}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChangeText={setPassword}
                                    style={styles.input}
                                    textStyle={{ fontSize: 16 }}
                                    size="large"
                                    secureTextEntry={!passwordVisible}
                                    accessoryRight={renderEyeIcon}
                                />
                                <View style={{ alignItems: 'center', marginBottom: 16 }}>
                                    <Text
                                        style={styles.link}
                                        onPress={() => Linking.openURL('https://flippify.io/l/reset-password')}
                                    >
                                        Forgot your password?
                                    </Text>
                                </View>
                                <Button onPress={handleLogin} style={styles.button}>
                                    Login
                                </Button>

                                <View style={styles.links}>
                                    <Text style={styles.linkText}>Don&apos;t have an account? </Text>
                                    <Text
                                        style={styles.link}
                                        onPress={() => Linking.openURL('https://flippify.io/l/sign-up')}
                                    >
                                        Sign up
                                    </Text>
                                </View>
                            </View>
                        </Layout>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 32,
        justifyContent: 'flex-start',
    }, 
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontFamily: 'Lato_900Black_Italic',
        fontSize: 32,
        fontStyle: 'italic',
    },
    subtitle: {
        fontSize: 18,
        marginTop: 4,
        color: Colors.textSecondary,
    },
    links: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    linkText: {
        fontSize: 16,
        color: Colors.textSecondary,
    },
    link: {
        fontSize: 16,
        color: 'dodgerblue',
        marginLeft: 4,
    },
    input: {
        marginBottom: 16,
    },
    button: {
        backgroundColor: Colors.houseBlue,
        marginTop: 8,
    },
});

export default LoginScreen;
