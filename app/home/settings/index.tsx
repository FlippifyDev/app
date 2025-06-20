// Local Imports
import ConnectedAccountsList from '@/src/components/settings/ConnectedAccounts';
import LogoutButton from '@/src/components/settings/LogoutButton';
import Profile from '@/src/components/settings/Profile';
import Subscription from '@/src/components/settings/Subscription';
import { SubScreenLayout } from '@/src/components/ui/SubScreenLayout';
import { useUser } from '@/src/hooks/useUser';
import { Colors } from '@/src/theme/colors';

// External Imports
import React from 'react';
import { StyleSheet, View } from 'react-native';


export default function SettingsScreen() {
    const user = useUser();

    return (
        <SubScreenLayout>
            <Profile user={user} />
            <View style={styles.accountInfoContainer}>
                <Subscription />
                <ConnectedAccountsList />
            </View>
            <View style={styles.logoutContainer}>
                <LogoutButton />
            </View>
        </SubScreenLayout>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        paddingBottom: 16,
        paddingHorizontal: 20,
        height: "100%",
        justifyContent: 'flex-start',
    },
    accountInfoContainer: {
        flexDirection: "row",
        gap: 12,
        justifyContent: "center"
    },
    logoutContainer: {
        flex: 1,
        height: "100%",
        justifyContent: "flex-end"
    }
})