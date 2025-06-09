// External Imports
import CompareResults from "@/src/components/home/market-compare/CompareResults";
import { useUser } from "@/src/hooks/useUser";
import { IMarketListedItem, IMarketSoldItem } from "@/src/models/market-compare";
import { fetchFunctions } from "@/src/services/market-compare/constants";
import { Colors } from "@/src/theme/colors";
import { Layout } from "@ui-kitten/components";

// Local Imports
import { useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function CompareScreen() {
    const { query } = useGlobalSearchParams();

    const user = useUser()

    const [listedResults, setListedResults] = useState<Record<string, IMarketListedItem>>({});
    const [soldResults, setSoldResults] = useState<Record<string, IMarketSoldItem>>({});
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const accounts = user?.connectedAccounts ? Object.keys(user.connectedAccounts) : [];

        async function fetchForType(type: "Listed" | "Sold") {
            if (typeof query === "object" || !query) return {};
            const newResults: Record<string, any> = {};

            for (const account of accounts) {
                const fn = fetchFunctions[`${account}${type}`];
                if (typeof fn !== "function") continue;

                try {
                    const result = await fn({ query });

                    if (!result.item) continue;
                    newResults[account] = result.item;
                } catch (err) {
                    console.error(`Error fetching ${type} data for ${account}:`, err);
                }
            }

            return newResults;
        }

        async function handleRun() {
            // Validate input
            if (typeof query === "object" || !query) return;
            if (!query.trim()) return;
            if (!accounts.length) return;

            setLoading(true);
            try {
                const listed = await fetchForType("Listed");
                setListedResults(listed);
            } catch (e) {
                setListedResults({});
                console.log("handleRun (listed)", e)
            }

            try {
                const sold = await fetchForType("Sold");
                setSoldResults(sold);
            } catch (e) {
                setSoldResults({});
                console.log("handleRun (sold)", e)
            }
            setLoading(false);
        }

        handleRun()
    }, [query, user?.connectedAccounts])

    return (
        <Layout style={styles.container}>
            {loading ? (
                <View style={{ flex: 1, height: "100%", justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <CompareResults loading={loading} listed={listedResults} sold={soldResults} />
            )}
        </Layout>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingHorizontal: 10,
        paddingTop: 32,
        paddingBottom: 0,
    }
})
