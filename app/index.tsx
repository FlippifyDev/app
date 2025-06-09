import { auth } from '@/src/config/firebase';
import { Stack, useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import LoginScreen from './login';
import { Colors } from '@/src/theme/colors';

const Index = () => {
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                // User is logged in → redirect to home
                router.replace('./home');
            } else {
                // Not logged in → stay here (login screen)
                setChecking(false);
            }
        });

        return () => unsubscribe();
    }, [router]);

    if (checking) {
        return (
            <>
                <Stack.Screen options={{ headerShown: false }} />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
                    <ActivityIndicator size="large" />
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
