// Local Imports
import CompareResults from "@/src/components/home/market-compare/CompareResults";
import { SubScreenLayout } from "@/src/components/ui/SubScreenLayout";
import { useMarketStorage } from "@/src/hooks/useMarketStorage";
import { useUser } from "@/src/hooks/useUser";
import { IMarketItem } from "@/src/models/market-compare";
import { IUser } from "@/src/models/user";
import { retrieveMarketItem } from "@/src/services/market-compare/retrieve";
import { Colors } from "@/src/theme/colors";
import { MARKET_ITEM_CACHE_PREFIX } from "@/src/utils/contants";

// External Imports
import { useFocusEffect, useGlobalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function CompareScreen() {
    const { query } = useGlobalSearchParams();

    const user = useUser()

    const [marketItem, setMarketItem] = useState<IMarketItem>();
    const [loading, setLoading] = useState(false);

    const { getItem, setItem } = useMarketStorage<IMarketItem>();
    const cacheKey = typeof query === "string" ? `${MARKET_ITEM_CACHE_PREFIX}${query.trim()}` : '';

    useFocusEffect(
        useCallback(() => {
            const accounts = user?.connectedAccounts ? Object.keys(user.connectedAccounts) : [];

            async function handleRun() {
                if (
                    typeof query === 'object' ||
                    !query?.trim() ||
                    !accounts.length ||
                    !cacheKey
                ) {
                    return;
                }

                const cached = await getItem(cacheKey);
                if (cached) {
                    setMarketItem(cached);
                    setLoading(false);
                    return;
                }

                setLoading(true);

                const { item, error } = await retrieveMarketItem({ user: user as IUser, query });
                if (error) throw error;
                if (item) {
                    setMarketItem(item);
                    await setItem(cacheKey, item);
                }

                setLoading(false);
            }

            handleRun();
        }, [query, user, cacheKey, getItem, setItem])
    );

    return (
        <SubScreenLayout>
            <View style={styles.container}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" />
                    </View>
                ) : (
                    <CompareResults loading={loading} marketItem={marketItem} cacheKey={cacheKey} />
                )}
            </View>
        </SubScreenLayout>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.background,
    }
})