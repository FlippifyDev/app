import { auth } from '@/src/config/firebase';
import { Colors } from '@/src/theme/colors';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import Constants from 'expo-constants';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LogoutButton() {
    const router = useRouter();
    const appVersion = Constants.expoConfig?.version ?? 'Unknown'; 

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.replace('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const openTerms = async () => {
        try {
            await Linking.openURL('https://flippify.io/l/terms-and-conditions'); 
        } catch (error) {
            console.error('Failed to open Terms and Conditions:', error);
        }
    };

    const openPrivacy = async () => {
        try {
            await Linking.openURL('https://flippify.io/l/privacy-policy'); 
        } catch (error) {
            console.error('Failed to open Privacy Policy:', error);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.logoutContainer} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} color={Colors.text} style={styles.icon} />
                <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
            <View style={styles.versionContainer}>
                <Text style={styles.versionText}>Version {appVersion}</Text>
            </View>
            <View style={styles.linksContainer}>
                <TouchableOpacity onPress={openTerms}>
                    <Text style={styles.linkText}>Terms and Conditions</Text>
                </TouchableOpacity>
                <Text style={styles.separator}> | </Text>
                <TouchableOpacity onPress={openPrivacy}>
                    <Text style={styles.linkText}>Privacy Policy</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center', 
        marginTop: 16, 
    },
    logoutContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    icon: {
        marginRight: 8,
    },
    linksContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    linkText: {
        fontSize: 14,
        color: Colors.textSecondary,
        textDecorationLine: 'underline',
    },
    separator: {
        fontSize: 14,
        color: Colors.text,
        marginHorizontal: 8,
    },
    versionContainer: {
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingTop: 6,
        marginTop: 8, 
    },
    versionText: {
        fontSize: 14,
        color: Colors.textSecondary,
        fontWeight: '500', 
        textAlign: 'center',
    },
});