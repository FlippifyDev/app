import { useUser } from '@/src/hooks/useUser';
import { IOrder } from '@/src/models/store-data';
import { retrieveOrders } from '@/src/services/bridges/retrieve';
import { Colors } from '@/src/theme/colors';
import { extractUserListingsCount } from '@/src/utils/extract';
import { formatDateToISO } from '@/src/utils/format';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';
import NoResultsFound from '../../ui/NoResultsFound';
import { TimeRange } from '../../ui/TimeFilter';
import OrderItem from './OrderItem';


const Active = ({ searchText, setRootItems, timeFilter }: { searchText?: string, timeFilter: TimeRange, setRootItems?: (value: IOrder[]) => void }) => {
    const user = useUser();
    const [items, setItems] = useState<IOrder[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [update, setUpdate] = useState(false);
    const [triggerUpdate, setTriggerUpdate] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Page Config
    const itemsPerPage = 12;
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
            if (!user) return;
            setLoading(true);

            const items = await retrieveOrders({
                uid: user.id as string,
                timeFrom: formatDateToISO(timeFilter.timeFrom),
                timeTo: formatDateToISO(timeFilter.timeTo),
                searchText,
                searchFields: ["customTag", "itemId", "storeType", "name", "purchase.platform", "storageLocation", "sku"],
                pagenate: true,
                nextPage,
                update
            })
            const activeItems = (items ?? []).filter(item => item.status === 'Active');
            setItems(activeItems);
            setRootItems?.(activeItems);

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
                keyExtractor={item => item.transactionId as string}
                renderItem={({ item }) => (
                    <OrderItem item={item} includeExtra />
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

export default Active


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
    error: {
        color: 'red',
    },
});