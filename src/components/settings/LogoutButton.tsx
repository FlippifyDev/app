import { auth } from '@/src/config/firebase';
import { Colors } from '@/src/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { signOut } from 'firebase/auth';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Review from './Review';
import { useUser } from '@/src/hooks/useUser';

export default function LogoutButton() {
    const user = useUser();
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
            await WebBrowser.openBrowserAsync('https://flippify.io/l/terms-and-conditions');
        } catch (error) {
            console.error('Failed to open Terms and Conditions:', error);
        }
    };

    const openPrivacy = async () => {
        try {
            await WebBrowser.openBrowserAsync('https://flippify.io/l/privacy-policy');
        } catch (error) {
            console.error('Failed to open Privacy Policy:', error);
        }
    };


    const openWebsiteProfile = async () => {
        try {
            await WebBrowser.openBrowserAsync(`https://flippify.io/u/${user?.username}/profile`);
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
                <Review />
                <Text style={styles.separator}> | </Text>
                <TouchableOpacity onPress={openWebsiteProfile}>
                    <Text style={styles.linkText}>Delete Account</Text>
                </TouchableOpacity>
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
        marginBottom: 10
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