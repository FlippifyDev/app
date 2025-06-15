import { IOrder } from '@/src/models/store-data';
import { Colors } from '@/src/theme/colors';
import { formatDate, shortenText } from '@/src/utils/format';
import { Text } from '@ui-kitten/components';
import CurrencyList from 'currency-list';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import Card from '../../ui/Card';
import FModal from '../../ui/FModal';

interface ItemProps {
    item: IOrder;
    includeExtra?: boolean;
}
const OrderItem: React.FC<ItemProps> = ({ item, includeExtra }) => {
    const currencySymbol = CurrencyList.get(item.sale?.currency ?? 'USD')?.symbol_native || '';
    const salePrice = item.sale?.price ?? 0;

    const [displayModal, setDisplayModal] = useState(false);

    const statusColor = (() => {
        switch (item.status) {
            case 'Completed':
                return Colors.successGreen;
            case 'Cancelled':
                return 'red';
            default:
                return Colors.houseBlue;
        }
    })();

    return (
        <View style={{ flex: 1 }}>
            <Card style={styles.entry} onPress={() => setDisplayModal(true)}>
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
                            {formatDate(item.sale?.date) ?? "N/A"}
                        </Text>
                    </View>

                    <View style={styles.priceContainer}>
                        {salePrice > 0 &&
                            <Text style={styles.positivePrice}>
                                +{currencySymbol}
                                {salePrice >= 1000 ? salePrice.toFixed(0) : salePrice.toFixed(2)}
                            </Text>
                        }
                        {salePrice === 0 &&
                            <Text style={styles.neutralPrice}>
                                {currencySymbol}
                                {salePrice.toFixed(2) ?? "N/A"}
                            </Text>
                        }
                    </View>
                </View>
            </Card>


            {displayModal && (
                <FModal visible onClose={() => setDisplayModal(false)}>
                    <ScrollView style={styles.modalContent}>
                        <Text style={[styles.modalTitle, { color: statusColor }]}>{item.status === "InProcess" ? "Shipped" : item.status}</Text>

                        <Section label="Order Info">
                            <Row label="Status" value={item.status === "InProcess" ? "Shipped" : item.status} />
                            <Row label="Item ID" value={item.itemId} />
                            <Row label="Order ID" value={item.orderId} />
                            <Row label="Transaction ID" value={item.transactionId} />
                        </Section>

                        <Section label="Item Info">
                            <Row label="Condition" value={item.condition ?? "N/A"} />
                            <Row label="SKU" value={item.sku ?? "N/A"} />
                            <Row label="Tag" value={item.customTag ?? "N/A"} />
                            <Row label="Storage" value={item.storageLocation ?? "N/A"} />

                            {item.extra && Object.entries(item.extra).map(([key, val]) => (
                                <Row
                                    key={key}
                                    label={key}
                                    value={val}
                                />
                            ))}
                        </Section>

                        <Section label="Purchase">
                            <Row label="Platform" value={item.purchase?.platform} />
                            <Row
                                label="Date"
                                value={formatDate(item.purchase?.date)}
                            />
                            <Row
                                label="Price"
                                value={
                                    item.purchase?.price != null
                                        ? `${currencySymbol}${item.purchase.price.toFixed(2)}`
                                        : 'N/A'
                                }
                            />
                            <Row
                                label="Quantity"
                                value={item.purchase?.quantity?.toString()}
                            />
                        </Section>

                        <Section label="Sale">
                            <Row label="Buyer" value={item.sale?.buyerUsername} />
                            <Row label="Platform" value={item.storeType} />
                            <Row
                                label="Date"
                                value={formatDate(item.sale?.date)}
                            />
                            <Row
                                label="Price"
                                value={
                                    item.sale?.price != null
                                        ? `${currencySymbol}${item.sale.price.toFixed(2)}`
                                        : 'N/A'
                                }
                            />
                            <Row
                                label="Quantity"
                                value={item.sale?.quantity?.toString()}
                            />
                        </Section>

                        <Section label="Shipping">
                            <Row
                                label="Service"
                                value={item.shipping?.service}
                            />
                            <Row
                                label="Fees"
                                value={
                                    item.shipping?.fees != null
                                        ? `${currencySymbol}${item.shipping.fees.toFixed(2)}`
                                        : 'N/A'
                                }
                            />
                            <Row
                                label="Date"
                                value={formatDate(item.shipping?.date)}
                            />
                            <Row
                                label="Tracking #"
                                value={item.shipping?.trackingNumber}
                            />
                        </Section>

                        <Section label="Taxes & Fees">
                            <Row
                                label="Tax Amount"
                                value={
                                    item.tax?.amount != null
                                        ? `${item.tax.currency ?? currencySymbol}${item.tax.amount.toFixed(2)}`
                                        : 'N/A'
                                }
                            />
                            <Row label="Tax Type" value={item.tax?.type} />
                            <Row
                                label="Additional Fees"
                                value={
                                    item.additionalFees != null
                                        ? `${currencySymbol}${item.additionalFees.toFixed(2)}`
                                        : 'N/A'
                                }
                            />
                            <Row
                                label="Buyer Fees"
                                value={
                                    item.buyerAdditionalFees != null
                                        ? `${currencySymbol}${item.buyerAdditionalFees.toFixed(2)}`
                                        : 'N/A'
                                }
                            />
                        </Section>

                        <Section label="Refund">
                            <Row
                                label="Amount"
                                value={
                                    item.refund?.amount != null
                                        ? `${item.refund.currency ?? currencySymbol}${item.refund.amount.toFixed(2)}`
                                        : 'N/A'
                                }
                            />
                            <Row
                                label="Status"
                                value={item.refund?.status}
                            />
                            <Row
                                label="Date"
                                value={formatDate(item.refund?.refundedAt)}
                            />
                        </Section>
                    </ScrollView>
                </FModal>
            )}

        </View>
    )
}

export default OrderItem;


const Section: React.FC<{ label: string, children: React.ReactNode }> = ({ label, children }) => (
    <View style={styles.section}>
        <Text style={styles.sectionLabel}>{label}</Text>
        {children}
    </View>
);

const Row: React.FC<{ label: string; value?: string | number | null }> = ({
    label,
    value,
}) => (
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
    positivePrice: {
        color: Colors.houseBlue,
        fontSize: 18,
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
    modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12, width: "100%", textAlign: "center" },

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
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 8,
    },

});