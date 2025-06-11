import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SwipeListView } from 'react-native-swipe-list-view';

import { useMarketStorage } from '@/src/hooks/useMarketStorage';
import { IMarketItem } from '@/src/services/market-compare/retrieve';
import { Ionicons } from '@expo/vector-icons';
import CurrencyList from 'currency-list';
import NoResultsFound from '../ui/NoResultsFound';

const MARKET_ITEM_CACHE_PREFIX = '@marketItem:';

export default function Recents() {
    const router = useRouter();
    const [recents, setRecents] = useState<{ query: string; item: IMarketItem }[]>([]);
    const [loading, setLoading] = useState(true);
    const { getAllItems } = useMarketStorage<IMarketItem>();

    const openRows = useRef<Record<string, boolean>>({});

    // Reload on screen focus
    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            async function loadRecents() {
                setLoading(true);
                try {
                    const items = await getAllItems();

                    if (isActive) setRecents(items);
                } catch (err) {
                    console.error(err);
                    if (isActive) setRecents([]);
                } finally {
                    if (isActive) setLoading(false);
                }
            }

            loadRecents();
            return () => {
                isActive = false;
            };
        }, [getAllItems])
    );

    // Remove from AsyncStorage + state
    const handleDelete = useCallback(async (query: string) => {
        const key = `${MARKET_ITEM_CACHE_PREFIX}${query}`;
        await AsyncStorage.removeItem(key);
        setRecents(curr => curr.filter(entry => entry.query !== query));
    }, []);

    const onSwipeValueChange = useCallback(({ key, value }: { key: string, value: number }) => {
        const partialOpenThreshold = -75;
        const fullDeleteThreshold = -250;

        if (value < fullDeleteThreshold) {
            handleDelete(key);
        } else if (value < partialOpenThreshold) {
            openRows.current[key] = true;
        } else if (value === 0) {
            delete openRows.current[key];
        }
    }, [handleDelete]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" />
            </View>
        );
    }

    if (recents.length === 0) {
        return <NoResultsFound />;
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <SwipeListView
                data={recents}
                keyExtractor={item => item.query}
                contentContainerStyle={styles.list}
                rightOpenValue={-75}
                disableRightSwipe={true}
                onSwipeValueChange={onSwipeValueChange}
                onRowOpen={() => { }}
                renderItem={({ item }) => {
                    const imgUri = item.item.listing?.image?.[0];
                    const currencySymbol =
                        CurrencyList.get(item.item.listing?.currency ?? 'USD')?.symbol_native || '';

                    return (
                        <TouchableOpacity
                            style={styles.entry}
                            activeOpacity={1}
                            onPress={() =>
                                router.push({
                                    pathname: '/home/compare-result',
                                    params: { query: item.query },
                                })
                            }
                        >
                            {imgUri && <Image source={{ uri: imgUri }} style={styles.entryImage} />}
                            <View style={styles.entryText}>
                                <Text style={styles.queryText}>{item.query}</Text>
                                <Text style={styles.subtitle}>
                                    {currencySymbol}
                                    {item.item.ebay?.listed?.price?.median?.toFixed(2) ?? '—'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}
                // Hidden behind view can be empty now
                renderHiddenItem={({ item }) => (
                    <View style={styles.rowBack}>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDelete(item.query)}
                        >
                            <Ionicons name="trash-outline" color="white" size={24} />
                        </TouchableOpacity>
                    </View>
                )}
            />
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, width: '100%' },
    loadingContainer: { flex: 1, justifyContent: 'center', width: '100%' },
    list: { paddingVertical: 8, paddingHorizontal: 16 },
    entry: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginVertical: 6,
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'visible',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    entryImage: {
        width: 48,
        height: 48,
        borderRadius: 4,
        marginRight: 12,
        backgroundColor: '#eee',
    },
    entryText: { flex: 1 },
    queryText: { fontSize: 16, fontWeight: '600', color: '#333' },
    subtitle: { marginTop: 4, fontSize: 14, color: '#666' },

    // Hidden row (delete)
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#ff3b30',
        flex: 1,
        marginVertical: 6,
        borderRadius: 8,
        justifyContent: 'flex-end',
        paddingRight: 20,
    },
    deleteButton: {
        width: "100%",
        height: '100%',
        justifyContent: 'center',
        alignItems: 'flex-end',
        borderRadius: 8,
    },
    deleteText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
