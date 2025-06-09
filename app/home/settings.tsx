// Local Imports
import ConnectedAccountsList from '@/src/components/settings/ConnectedAccounts';
import LogoutButton from '@/src/components/settings/LogoutButton';
import Profile from '@/src/components/settings/Profile';
import Subscription from '@/src/components/settings/Subscription';
import { useUser } from '@/src/hooks/useUser';
import { Colors } from '@/src/theme/colors';

// External Imports
import { Layout } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, View } from 'react-native';


export default function SettingsScreen() {
    const user = useUser();

    return (
        <Layout style={styles.container}>
            <Profile user={user} />
            <Subscription user={user} />
            <ConnectedAccountsList user={user} />
            <View style={styles.logoutContainer}>
                <LogoutButton />
            </View>
        </Layout>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingTop: 32,
        paddingBottom: 16,
        paddingHorizontal: 20,
        justifyContent: 'flex-start',
    },
    logoutContainer: {
        flex: 1,
        height: "100%",
        justifyContent: "flex-end"
    }
})