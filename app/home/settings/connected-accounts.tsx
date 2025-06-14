import PageTitle from "@/src/components/ui/PageTitle";
import { SubScreenLayout } from "@/src/components/ui/SubScreenLayout";
import { useUser } from "@/src/hooks/useUser";
import { Colors } from "@/src/theme/colors";
import { mapAccountToAccountName } from "@/src/utils/contants";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ConnectedAccountsScreen() {
    const user = useUser();
    const [accounts, setAccounts] = useState<[string, any][]>([]);

    useEffect(() => {
        if (!user) return;

        const connectedAccounts = user.connectedAccounts
            ? Object.entries(user.connectedAccounts).filter(([_, value]) => value != null)
            : [];

        setAccounts(connectedAccounts);
    }, [user]);

    return (
        <SubScreenLayout>
            <View style={styles.container}>
                <View style={{ marginBottom: 30 }}>
                    <PageTitle text="Accounts" />
                </View>

                {accounts.map(([provider, _]) => (
                    <View style={styles.accountItem} key={provider}>
                        <Ionicons name="checkmark-circle" size={20} color={Colors.iconGreen} style={{ marginRight: 8 }} />
                        <Text style={styles.accountText}>Connected to {mapAccountToAccountName[provider]}</Text>
                    </View>
                ))}
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
    empty: {
        marginTop: 20,
        fontStyle: "italic",
        color: "#888",
    },
});
