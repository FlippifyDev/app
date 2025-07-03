import { IOrder } from '@/src/models/store-data';
import { Colors } from '@/src/theme/colors';
import { calculateOrderProfit } from '@/src/utils/calculate';
import { formatDate, shortenText } from '@/src/utils/format';
import { Avatar, Text } from '@ui-kitten/components';
import CurrencyList from 'currency-list';
import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Card from '../../ui/Card';
import FItemModal from '../../ui/FItemModal';
import Price from '../../ui/Price';
import { Section } from './Section';

interface ItemProps {
    item: IOrder;
    includeExtra?: boolean;
}
const OrderItem: React.FC<ItemProps> = ({ item, includeExtra }) => {
    const currencySymbol = CurrencyList.get(item.sale?.currency ?? 'USD')?.symbol_native || '';
    const profit = calculateOrderProfit({ item })

    const [displayModal, setDisplayModal] = useState(false);

    return (
        <View style={{ flex: 1 }}>
            <Card style={styles.entry} onPress={() => setDisplayModal(true)}>
                {item.image?.[0] && <Image source={{ uri: item.image[0] }} style={styles.entryImage} />}
                {!item.image?.[0] && <View style={styles.entryImage} />}
                <View style={styles.entryText}>

                    <View style={styles.subText}>
                        <Text style={styles.nameText}>{shortenText(item.name as string, 20)}</Text>
                        {(includeExtra && item.storageLocation) && (
                            <React.Fragment>
                                <Text style={styles.subtitle}>{item.storageLocation ?? "N/A"}</Text>
                            </React.Fragment>
                        )}
                        <Text style={styles.subtitle}>
                            {`${currencySymbol}${item.sale?.price?.toFixed(2)}`}
                        </Text>
                        <Text style={styles.subtitle}>
                            {formatDate(item.sale?.date) ?? "N/A"}
                        </Text>
                    </View>

                    <View style={styles.priceContainer}>
                        <Price price={profit} currencySymbol={currencySymbol} baseSize={20} showSymbol style={profit > 0 ? styles.positivePrice : styles.neutralPrice} />
                    </View>
                </View>
            </Card>

            <FItemModal visible={displayModal} onClose={() => setDisplayModal(false)}>
                <View style={{ width: "100%", alignItems: "center" }}>
                    {item.image?.[0] && (
                        <Avatar source={{ uri: item.image[0] }} style={styles.modalImage} />
                    )}
                </View>

                <Text style={styles.modalTitle}>
                    {item.name || "Listing Details"}
                </Text>
                <Text style={[styles.modalSubTitle, { color: Colors.background }]}>
                    {item.status === "InProcess" ? "Shipped" : item.status}
                </Text>



                <Section
                    rows={[
                        { label: "Status", value: item.status === "InProcess" ? "Shipped" : item.status },
                        { label: "Item ID", value: item.itemId },
                        { label: "Order ID", value: item.orderId },
                        { label: "Transaction ID", value: item.transactionId },
                        { label: "Profit", value: `${currencySymbol}${profit.toFixed(2)}` },
                    ]}
                />

                <Section
                    rows={[
                        { label: "Condition", value: item.condition ?? "N/A" },
                        { label: "SKU", value: item.sku ?? "N/A" },
                        { label: "Tag", value: item.customTag ?? "N/A" },
                        { label: "Storage", value: item.storageLocation ?? "N/A" },
                        ...(item.extra
                            ? Object.entries(item.extra).map(([key, val]) => ({ label: key, value: val }))
                            : []),
                    ]}
                />

                <Section
                    rows={[
                        { label: "Platform", value: item.purchase?.platform },
                        { label: "Date", value: formatDate(item.purchase?.date) },
                        {
                            label: "Price",
                            value:
                                item.purchase?.price != null
                                    ? `${currencySymbol}${item.purchase.price.toFixed(2)}`
                                    : "N/A",
                        },
                        { label: "Quantity", value: item.purchase?.quantity?.toString() },
                    ]}
                />

                <Section
                    rows={[
                        { label: "Buyer", value: item.sale?.buyerUsername },
                        { label: "Platform", value: item.storeType },
                        { label: "Date", value: formatDate(item.sale?.date) },
                        {
                            label: "Price",
                            value:
                                item.sale?.price != null
                                    ? `${currencySymbol}${item.sale.price.toFixed(2)}`
                                    : "N/A",
                        },
                        { label: "Quantity", value: item.sale?.quantity?.toString() },
                    ]}
                />

                <Section
                    rows={[
                        { label: "Service", value: item.shipping?.service },
                        {
                            label: "Fees",
                            value:
                                item.shipping?.fees != null
                                    ? `${currencySymbol}${item.shipping.fees.toFixed(2)}`
                                    : "N/A",
                        },
                        { label: "Date", value: formatDate(item.shipping?.date) },
                        { label: "Tracking #", value: item.shipping?.trackingNumber },
                    ]}
                />

                <Section
                    rows={[
                        {
                            label: "Tax Amount",
                            value:
                                item.tax?.amount != null
                                    ? `${currencySymbol}${item.tax.amount.toFixed(2)}`
                                    : "N/A",
                        },
                        { label: "Tax Type", value: item.tax?.type },
                        {
                            label: "Additional Fees",
                            value:
                                item.additionalFees != null
                                    ? `${currencySymbol}${item.additionalFees.toFixed(2)}`
                                    : "N/A",
                        },
                        {
                            label: "Buyer Fees",
                            value:
                                item.buyerAdditionalFees != null
                                    ? `${currencySymbol}${item.buyerAdditionalFees.toFixed(2)}`
                                    : "N/A",
                        },
                    ]}
                />

                <Section
                    rows={[
                        {
                            label: "Amount",
                            value:
                                item.refund?.amount != null
                                    ? `${currencySymbol}${item.refund.amount.toFixed(2)}`
                                    : "N/A",
                        },
                        { label: "Status", value: item.refund?.status },
                        { label: "Date", value: formatDate(item.refund?.refundedAt) },
                    ]}
                />
            </FItemModal>

        </View>
    )
}

export default OrderItem;



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
    positivePrice: {
        color: Colors.houseBlue,
        fontWeight: "bold",
    },
    neutralPrice: {
        color: Colors.text,
        fontSize: 18,
        fontWeight: "bold",
    },
    subText: {
        width: "70%",
        flexDirection: "column",
        justifyContent: "space-between"
    },
    modalImage: {
        marginBottom: 16,
        width: 96,
        height: 96,
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

    modalContent: { color: Colors.text, marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12, textAlign: "center", color: Colors.background },
    modalSubTitle: { fontSize: 14, fontWeight: '700', marginBottom: 12, textAlign: "center", color: Colors.background },
});