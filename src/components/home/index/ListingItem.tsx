import { IListing } from '@/src/models/store-data';
import { Colors } from '@/src/theme/colors';
import { formatDate, shortenText } from '@/src/utils/format';
import { Text } from '@ui-kitten/components';
import CurrencyList from 'currency-list';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import Card from '../../ui/Card';
import FModal from '../../ui/FModal';

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
                        <Text style={styles.price}>
                            {currencySymbol}
                            {item.price?.toFixed(2) ?? "N/A"}
                        </Text>
                    </View>
                </View>
            </Card>

            {showModal && (
                <FModal visible onClose={() => setShowModal(false)}>
                    <ScrollView style={styles.modalContent}>
                        {item.image?.[0] && <Image source={{ uri: item.image[0] }} style={styles.modalImage} />}
                        <Text style={styles.modalTitle}>{item.name || 'Listing Details'}</Text>

                        <Section label="Listing Info">
                            <Row label="Item ID" value={item.itemId} />
                            <Row label="Store" value={item.storeType} />
                            <Row label="Date Listed" value={formatDate(item.dateListed)} />
                            <Row label="Quantity" value={item.quantity} />
                            <Row label="Initial Quantity" value={item.initialQuantity} />
                            <Row label="Price" value={item.price != null ? `${currencySymbol}${item.price.toFixed(2)}` : 'N/A'} />
                        </Section>

                        <Section label="Item Details">
                            <Row label="Condition" value={item.condition} />
                            <Row label="SKU" value={item.sku} />
                            <Row label="Custom Tag" value={item.customTag} />
                            <Row label="Storage Location" value={item.storageLocation} />
                            {item.extra && Object.entries(item.extra).map(([key, val]) => (
                                <Row key={key} label={key} value={val} />
                            ))}
                        </Section>

                        {item.purchase && (
                            <Section label="Purchase Info">
                                <Row label="Platform" value={item.purchase.platform} />
                                <Row label="Date" value={formatDate(item.purchase.date)} />
                                <Row label="Price" value={item.purchase.price != null ? `${currencySymbol}${item.purchase.price.toFixed(2)}` : 'N/A'} />
                            </Section>
                        )}
                    </ScrollView>
                </FModal>
            )}
        </View>
    );
};

const Section: React.FC<{ label: string, children: React.ReactNode }> = ({ label, children }) => (
    <View style={styles.section}>
        <Text style={styles.sectionLabel}>{label}</Text>
        {children}
    </View>
);

const Row: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => (
    <View style={styles.row}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value ?? 'N/A'}</Text>
    </View>
);

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
    modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12, textAlign: 'center', color: Colors.text },
    modalImage: { width: '100%', height: 200, resizeMode: 'contain', marginBottom: 16 },
    section: { marginTop: 16 },
    sectionLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 4,
        color: Colors.text
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
    },
    rowLabel: {
        fontWeight: '500',
        color: Colors.text
    },
    rowValue: { flex: 1, textAlign: 'right', color: Colors.text },
});

export default ListingItem;