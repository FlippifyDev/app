import { IListing } from '@/src/models/store-data';
import { Colors } from '@/src/theme/colors';
import { formatDate, shortenText } from '@/src/utils/format';
import { Avatar, Text } from '@ui-kitten/components';
import CurrencyList from 'currency-list';
import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Card from '../../ui/Card';
import FItemModal from '../../ui/FItemModal';
import { Section } from './Section';
import Price from '../../ui/Price';

interface ItemProps {
    item: IListing;
    includeExtra?: boolean;
}

const ListingItem: React.FC<ItemProps> = ({ item, includeExtra }) => {
    const currencySymbol = CurrencyList.get(item.currency ?? 'USD')?.symbol_native || '';
    const [showModal, setShowModal] = useState(false);

    return (
        <View style={{ flex: 1 }}>
            <Card style={styles.entry} onPress={() => setShowModal(true)}>
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
                        {typeof item.price === "number" ? (
                            <Price price={item.price ?? 0} currencySymbol={currencySymbol} baseSize={20} style={styles.price} />
                        ): (
                            <Text style={styles.price}>
                                N/A
                            </Text>
                        )}
                    </View>
                </View>
            </Card>

            <FItemModal
                visible={showModal}
                onClose={() => setShowModal(false)}
            >
                <View style={{ width: "100%", alignItems: "center" }}>
                    {item.image?.[0] && (
                        <Avatar source={{ uri: item.image[0] }} style={styles.modalImage} />
                    )}
                </View>
                <Text style={styles.modalTitle}>{item.name || "Listing Details"}</Text>

                <Section
                    rows={[
                        { label: "Item ID", value: item.itemId },
                        { label: "Store", value: item.storeType },
                        { label: "Listed", value: formatDate(item.dateListed) },
                        { label: "Quantity", value: item.quantity },
                        { label: "Initial Quantity", value: item.initialQuantity },
                        {
                            label: "Price",
                            value:
                                item.price != null
                                    ? `${currencySymbol}${item.price.toFixed(2)}`
                                    : "N/A",
                        },
                    ]}
                />

                <Section
                    rows={[
                        { label: "Condition", value: item.condition ?? "N/A" },
                        { label: "SKU", value: item.sku ?? "N/A" },
                        { label: "Custom Tag", value: item.customTag ?? "N/A" },
                        { label: "Storage Location", value: item.storageLocation ?? "N/A" },
                        ...(item.extra
                            ? Object.entries(item.extra).map(([key, val]) => ({
                                label: key,
                                value: val,
                            }))
                            : []),
                    ]}
                />

                {item.purchase && (
                    <Section
                        rows={[
                            { label: "Purchase Platform", value: item.purchase.platform },
                            { label: "Purchase Date", value: formatDate(item.purchase.date) },
                            {
                                label: "Purchase Price",
                                value:
                                    item.purchase.price != null
                                        ? `${currencySymbol}${item.purchase.price.toFixed(2)}`
                                        : "N/A",
                            },
                        ]}
                    />
                )}
            </FItemModal>
        </View>
    );
};


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
    modalContent: { marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12, textAlign: 'center', color: Colors.background },
    modalImage: {
        marginBottom: 16,
        width: 96,
        height: 96,
    },
});

export default ListingItem;