import PageTitle from "@/src/components/ui/PageTitle";
import { SubScreenLayout } from "@/src/components/ui/SubScreenLayout";
import { useUser } from "@/src/hooks/useUser";
import { Colors } from "@/src/theme/colors";
import { mapAccountToAccountName } from "@/src/utils/contants";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ConnectedAccountsScreen() {
    const user = useUser();
    const [accounts, setAccounts] = useState<[string, any][]>([]);

    useEffect(() => {
        if (!user) return;

        const connectedAccounts = user.connectedAccounts
            ? Object.entries(user.connectedAccounts).filter(([_, value]) => value != null)
            : [];

        console.log(connectedAccounts)

        setAccounts(connectedAccounts);
    }, [user]);


    return (
        <SubScreenLayout>
            <View style={styles.container}>
                <View style={{ marginBottom: 30 }}>
                    <PageTitle text="Accounts" />
                </View>

                {accounts.length > 0 ? (
                    <React.Fragment>
                        {
                            accounts.map(([provider, _]) => (
                                <View style={styles.accountItem} key={provider}>
                                    {provider && (
                                        <React.Fragment>
                                            <Ionicons name="checkmark-circle" size={20} color={Colors.iconGreen} style={{ marginRight: 8 }} />
                                            <Text style={styles.accountText}>Connected to {mapAccountToAccountName[provider]}</Text>
                                        </React.Fragment>
                                    )}
                                </View>
                            ))
                        }
                    </React.Fragment>
                ) : (
                    <View style={{ flex: 1 }}>
                        <Text style={styles.connectAccountText}>No account connected</Text>
                        <Text style={styles.connectAccountText}>Please login to our website to connect an account.</Text>
                    </View>
                )}
            </View>
        </SubScreenLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 16,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 16,
    },
    accountItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        flexDirection: "row",
        alignItems: "center",
    },
    providerName: {
        fontSize: 16,
        fontWeight: "500",
    },
    accountText: {
        fontWeight: '600',
        color: Colors.text,
    },
    connectAccountText: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: "center"
    },
    empty: {
        marginTop: 20,
        fontStyle: "italic",
        color: "#888",
    },
});
