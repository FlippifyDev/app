import { useUser } from '@/src/hooks/useUser';
import { IListing } from '@/src/models/store-data';
import { retrieveInventory } from '@/src/services/bridges/retrieve';
import { Colors } from '@/src/theme/colors';
import { extractUserListingsCount } from '@/src/utils/extract';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import ListingItem from './ListingItem';


const ninetyDaysAgoISO = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 90);
    return d.toISOString();
})();

const Inventory = ({ searchText }: { searchText?: string }) => {
    const user = useUser();
    const [items, setItems] = useState<IListing[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [triggerUpdate, setTriggerUpdate] = useState(true);

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

            const items = await retrieveInventory({ uid: user.id as string, timeFrom: ninetyDaysAgoISO, searchText, searchFields: ["customTag", "itemId", "storeType", "name", "purchase.platform", "storageLocation", "sku"], pagenate: true, nextPage })
            setItems(items ?? []);

            setLoading(false);

        }

        if ((user?.authentication?.subscribed && triggerUpdate) || nextPage) {
            fetchItems();
        }
    }, [user, nextPage, searchText, triggerUpdate]);

    function handleEndReached() {
        if (currentPage >= totalPages) return;

        setNextPage(true);
        setCurrentPage(currentPage + 1)
    }

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="small" />
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <FlatList
                data={paginatedData}
                style={{ paddingHorizontal: 4 }}
                keyExtractor={item => item.itemId as string}
                renderItem={({ item }) => (
                    <ListingItem item={item} />
                )}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.5}
                ListFooterComponent={() => loading ? <ActivityIndicator style={{ margin: 16 }} /> : null}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
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