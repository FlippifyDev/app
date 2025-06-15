import { IListing } from '@/src/models/store-data';
import { Colors } from '@/src/theme/colors';
import { formatDate, shortenText } from '@/src/utils/format';
import { Text } from '@ui-kitten/components';
import CurrencyList from 'currency-list';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Card from '../../ui/Card';

interface ItemProps {
    item: IListing;
    includeExtra?: boolean;
}
const ListingItem: React.FC<ItemProps> = ({ item, includeExtra }) => {
    const currencySymbol = CurrencyList.get(item.currency ?? 'USD')?.symbol_native || '';

    return (
        <Card style={styles.entry}>
            {item.image?.[0] && <Image source={{ uri: item.image[0] }} style={styles.entryImage} />}
            {!item.image?.[0] && <View style={styles.entryImage} />}
            <View style={styles.entryText}>
                <View style={styles.subText}>
                    <Text style={styles.nameText}>{shortenText(item.name as string, 20)}</Text>
                    {includeExtra && (
                        <React.Fragment>
                            <Text style={styles.subtitle}>{item.storageLocation ?? "N/A"}</Text>
                        </React.Fragment>
                    )}

                    <Text style={styles.subtitle}>
                        {formatDate(item.dateListed) ?? "N/A"}
                    </Text>
                </View>
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>
                        {currencySymbol}
                        {item.price?.toFixed(2) ?? "N/A"}
                    </Text>
                </View>
            </View>
        </Card>
    )
}

export default ListingItem;


const styles = StyleSheet.create({
    entry: {
        paddingHorizontal: 12,
        paddingVertical: 24,
    },
    entryImage: {
        width: 48,
        height: 48,
        borderRadius: 9999,
        marginRight: 12,
        backgroundColor: Colors.cardBackground,
    },
    priceContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-end",
        width: '30%',
    },
    price: {
        color: Colors.textSubtitle,
        fontSize: 18,
        fontWeight: "bold"
    },
    subText: {
        width: "70%",
        flexDirection: "column",
        justifyContent: "space-between"
    },
    entryText: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    nameText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    subtitle: { marginTop: 4, fontSize: 14, color: Colors.textSubtitle },
});