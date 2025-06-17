import Card from "@/src/components/ui/Card";
import PageTitle from "@/src/components/ui/PageTitle";
import { SubScreenLayout } from "@/src/components/ui/SubScreenLayout";
import { useUser } from "@/src/hooks/useUser";
import { IExpenses, INumListings, INumOrders, ISubscription } from "@/src/models/user";
import { Colors } from "@/src/theme/colors";
import { extractUserSubscription } from "@/src/utils/extract";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function SubscriptionScreen() {
    const user = useUser();
    const [subscriptionName, setSubscriptionName] = useState<string>();
    const [numListings, setNumListings] = useState<INumListings>();
    const [numOrders, setNumOrders] = useState<INumOrders>();
    const [numExpenses, setNumExpenses] = useState<IExpenses>();


    useEffect(() => {
        if (!user) return

        const userSubscripton = extractUserSubscription(user?.subscriptions as ISubscription[]);
        setSubscriptionName(userSubscripton?.name ?? "No Subscribed")

        setNumListings(user?.store?.numListings as INumListings);
        setNumOrders(user?.store?.numOrders as INumOrders);
        setNumExpenses(user?.store?.numExpenses as IExpenses);


    }, [user])

    return (
        <SubScreenLayout>
            <PageTitle text={subscriptionName ?? "Not Subscriped"} />

            <View style={[styles.cardGrid, { marginTop: 20 }]}>
                <Card style={{ width: "48%" }}>
                    <View style={styles.innerCardContainer}>
                        <Text style={styles.value}>{(numListings?.manual ?? 0) + (numListings?.automatic ?? 0)}</Text>
                        <Text style={styles.label}>Inventory</Text>
                    </View>
                </Card>
                <Card style={{ width: "48%" }}>
                    <View style={styles.innerCardContainer}>
                        <Text style={styles.value}>{(numOrders?.totalManual ?? 0) + (numOrders?.totalAutomatic ?? 0)}</Text>
                        <Text style={styles.label}>Sales</Text>
                    </View>
                </Card>
            </View>
            <View style={[styles.cardGrid]}>
                <Card style={{ width: "48%" }}>
                    <View style={styles.innerCardContainer}>
                        <Text style={styles.value}>{(numExpenses?.totalOneTime ?? 0)}</Text>
                        <Text style={styles.label}>Expenses</Text>
                    </View>
                </Card>
                <Card style={{ width: "48%" }}>
                    <View style={styles.innerCardContainer}>
                        <Text style={styles.value}>{(numExpenses?.subscriptions ?? 0)}</Text>
                        <Text style={styles.label}>Subscriptions</Text>
                    </View>
                </Card>
            </View>

        </SubScreenLayout>
    );
}

const styles = StyleSheet.create({
    cardGrid: {
        flexDirection: "row",
        gap: 12,
        justifyContent: "center"
    },
    innerCardContainer: {
        flexDirection: "column",
        borderRadius: 16,
        padding: 8,
        alignItems: "flex-start",
        justifyContent: "center",
    },
    label: {
        color: Colors.textSecondary,
        fontSize: 16,
        marginTop: 8,
        fontWeight: "bold"
    },
    value: {
        fontSize: 24,
        color: Colors.text,
        fontWeight: "bold"
    }
});
