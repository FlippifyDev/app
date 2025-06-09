import React from 'react';
import { Button } from '@ui-kitten/components';
import { signOut } from 'firebase/auth';
import { auth } from '@/src/config/firebase';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.replace('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <Button style={styles.button} status="danger" onPress={handleLogout}>
            Logout
        </Button>
    );
}


const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.cardBackground,
    },
});