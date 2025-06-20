import { useUser } from '@/src/hooks/useUser';
import { Colors } from '@/src/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { Layout, Text } from '@ui-kitten/components';
import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import FButton from '../../ui/FButton';

const NoAccess = () => {
    const user = useUser();

    const openPlans = async () => {
        try {
            await Linking.openURL(`https://flippify.io/u/${user?.username}/plans`);
        } catch (error) {
            console.error('Failed to open plans:', error);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <Layout style={styles.content} level="1">
                    <View style={styles.iconWrapper}>
                        <Ionicons
                            name="alert-circle-outline"
                            size={48}
                            color={Colors.houseBlue}
                        />
                    </View>
                    <Text style={styles.message} category="h6">
                        No Access
                    </Text>
                    <Text style={styles.subtitle}>
                        A paid subscription is required to access this app.
                    </Text>
                    <FButton
                        title="Subscribe Now"
                        style={styles.button}
                        onPress={openPlans}
                    />
                </Layout>
            </ScrollView>
        </SafeAreaView>
    )
};

export default NoAccess;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 16,
        borderRadius: 8,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    message: {
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 18,
        color: Colors.text,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 16,
    },
    iconWrapper: {
        marginBottom: 12,
    },
    button: {
        marginTop: 8,
        alignSelf: 'stretch',
    },
});
