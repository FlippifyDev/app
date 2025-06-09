import { IUser } from "@/src/models/user";
import { Colors } from "@/src/theme/colors";
import { extractUserSubscription } from "@/src/utils/extract";
import { Ionicons } from "@expo/vector-icons";
import { Layout, Text } from "@ui-kitten/components";
import { StyleSheet, View } from "react-native";

interface Props {
    user?: IUser
}

const Subscription: React.FC<Props> = ({ user }) => {
    const subscription = extractUserSubscription(user?.subscriptions ?? []);

    return (
        <Layout style={styles.container}>
            <Text category="h6">Subscription</Text>
            <View style={styles.accountContainer}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.iconGreen} style={{ marginRight: 8 }} />

                <Text style={styles.accountText}>{subscription?.name ?? "No subscription"}</Text>
            </View>
        </Layout>
    );
};


const styles = StyleSheet.create({
    container: {
        backgroundColor: "transparent",
        marginTop: 16
    },
    accountContainer: {
        marginTop: 8,
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
})


export default Subscription;