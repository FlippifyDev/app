import { useUser } from '@/src/hooks/useUser';
import { IListing } from '@/src/models/store-data';
import { retrieveInventory } from '@/src/services/bridges/retrieve';
import { Colors } from '@/src/theme/colors';
import { extractUserListingsCount } from '@/src/utils/extract';
import { formatDateToISO } from '@/src/utils/format';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';
import NoResultsFound from '../../ui/NoResultsFound';
import { TimeRange } from '../../ui/TimeFilter';
import ListingItem from './ListingItem';


const Inventory = ({ searchText, setRootItems, timeFilter }: { searchText?: string, timeFilter: TimeRange, setRootItems?: (value: IListing[]) => void }) => {
    const user = useUser();
    const [items, setItems] = useState<IListing[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [update, setUpdate] = useState(false);
    const [triggerUpdate, setTriggerUpdate] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Page Config
    const itemsPerPage = 24;
    const [currentPage, setCurrentPage] = useState(1);
    const totalListings = extractUserListingsCount(user);
    const totalPages = Math.ceil(totalListings / itemsPerPage);

    const paginatedData = items.slice(
        0,
        currentPage * itemsPerPage
    );
    const [nextPage, setNextPage] = useState(false);

    useEffect(() => {
        setTriggerUpdate(true);
    }, [searchText])

    useEffect(() => {
        async function fetchItems() {
            setLoading(true);
            if (!user) return;

            const items = await retrieveInventory({
                uid: user.id as string,
                timeFrom: formatDateToISO(timeFilter.timeFrom),
                timeTo: formatDateToISO(timeFilter.timeTo),
                searchText,
                searchFields: ["customTag", "itemId", "storeType", "name", "purchase.platform", "storageLocation", "sku"],
                pagenate: true,
                nextPage,
                update
            })
            setItems(items ?? []);
            setRootItems?.(items ?? [])

            setLoading(false);

            setNextPage(false);
            setTriggerUpdate(false);
            setUpdate(false);
            setRefreshing(false);
        }

        if ((user?.authentication?.subscribed && triggerUpdate) || nextPage) {
            fetchItems();
        }
    }, [user, nextPage, searchText, triggerUpdate, setRootItems, timeFilter, update]);

    function handleEndReached() {
        if (currentPage >= totalPages) return;

        setNextPage(true);
        setCurrentPage(currentPage + 1)
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setUpdate(true);
        setTriggerUpdate(true);
        setCurrentPage(1);
    }, []);


    return (
        <View style={styles.container}>
            <FlatList
                data={paginatedData}
                style={{ paddingHorizontal: 4 }}
                keyExtractor={item => item.itemId as string}
                renderItem={({ item }) => (
                    <ListingItem item={item} />
                )}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.5}
                ListFooterComponent={() => loading ? <ActivityIndicator style={{ margin: 16 }} /> : null}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={Colors.gray}
                        size={10}
                    />
                }
                ListEmptyComponent={() => (
                    <View style={styles.noResultContainer}>
                        <NoResultsFound />
                    </View>
                )}
            />
        </View>
    )
}

export default Inventory


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: Colors.background,
    },
    noResultContainer: {
        flex: 1,
        justifyContent: "center",
        height: 400
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
    error: {
        color: 'red',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    pageBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#eee',
        borderRadius: 4,
    },
    disabledBtn: {
        opacity: 0.5,
    },
    pageInfo: {
        fontSize: 14,
    },
});