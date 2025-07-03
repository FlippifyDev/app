// Local Imports
import ConnectedAccountsList from '@/src/components/settings/ConnectedAccounts';
import LogoutButton from '@/src/components/settings/LogoutButton';
import Plans from '@/src/components/settings/plans/Plans';
import Profile from '@/src/components/settings/Profile';
import Socials from '@/src/components/settings/Socials';
import Subscription from '@/src/components/settings/Subscription';
import { SubScreenLayout } from '@/src/components/ui/SubScreenLayout';
import { useUser } from '@/src/hooks/useUser';

// External Imports
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';


export default function SettingsScreen() {
    const user = useUser();
    const windowHeight = Dimensions.get('window').height;

    return (
        <SubScreenLayout>
            <View style={[styles.container, { height: windowHeight - 110 }]}>
                <View style={styles.content}>
                    <Profile user={user} />
                    <View style={styles.accountInfoContainer}>
                        <Subscription />
                        <ConnectedAccountsList />
                    </View>
                    <View style={styles.accountInfoContainer}>
                        <Plans />
                        <Socials />
                    </View>
                </View>

                <View style={[styles.logoutContainer]}>
                    <LogoutButton />
                </View>
            </View>
        </SubScreenLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between"
    },
    content: {
        flex: 1,
    },
    accountInfoContainer: {
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'center',
    },
    logoutContainer: {
        alignItems: 'center',
    },
});