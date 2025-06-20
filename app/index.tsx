import Landing from '@/src/components/login/Landing';
import { auth } from '@/src/config/firebase';
import { refreshTokens } from '@/src/services/api/refresh-tokens';
import { Lato_900Black_Italic, useFonts } from '@expo-google-fonts/lato';
import { Text } from '@ui-kitten/components';
import { Stack, useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import LoginScreen from './login';

const Index = () => {
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    const [fontsLoaded] = useFonts({
        Lato_900Black_Italic,
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                // User is logged in: get idToken and refresh tokens in the background
                user.getIdToken().then(idToken => {
                    refreshTokens({ idToken }).catch(error => {
                        console.error('Error refreshing tokens:', error);
                    });
                });
                // Redirect to home immediately
                router.replace('./home');
            } else {
                // Not logged in: stop checking and show login screen
                setChecking(false);
            }
        });

        // Cleanup the listener when the component unmounts
        return () => unsubscribe();
    }, [router]);

    if (checking) {
        return (
            <>
                <Stack.Screen options={{ headerShown: false }} />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {fontsLoaded && (
                        <Text category="h1" style={styles.title}>
                            flippify
                        </Text>
                    )}
                    <Landing />
                </View>
            </>
        );
    }

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <LoginScreen />
        </>
    );
};


export default Index;


const styles = StyleSheet.create({
    title: {
        marginBottom: 40,
        fontFamily: "Lato_900Black_Italic",
        fontSize: 48,
        fontStyle: "italic",
        color: "black",
    },
})