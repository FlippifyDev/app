import { IUser } from "@/src/models/user";
import { Colors } from "@/src/theme/colors";
import { mapAccountToAccountName } from "@/src/utils/contants";
import { Ionicons } from "@expo/vector-icons";
import { Layout, Text } from "@ui-kitten/components";
import { FlatList, StyleSheet, View } from "react-native";

interface Props {
    user?: IUser;
}

const ConnectedAccountsList: React.FC<Props> = ({ user }) => {
    const accounts = user?.connectedAccounts ? Object.entries(user.connectedAccounts) : [];

    if (accounts.length === 0) {
        return null;
    }

    const renderItem = ([provider, account]: [string, any]) =>
        account ? (
            <View style={styles.accountContainer} key={provider}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.iconGreen} style={{ marginRight: 8 }} />
                <Text style={styles.accountText}>Connected to {mapAccountToAccountName[provider]}</Text>
            </View>
        ) : null;

    return (
        <Layout style={styles.container}>
            <Text category="h6">Connected Accounts</Text>
            <FlatList
                data={accounts}
                keyExtractor={([provider]) => provider}
                renderItem={({ item }) => renderItem(item)}
                contentContainerStyle={styles.listContent}
            />
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "transparent",
        marginTop: 16
    },
    listContent: {
        paddingVertical: 8,
        gap: 6, 
    },
    accountContainer: {
        flexDirection: 'row',
        borderRadius: 16,
        padding: 16,
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: Colors.cardBackground,
    },
    accountText: {
        fontWeight: '600',
        color: Colors.text,
    },
});

export default ConnectedAccountsList;