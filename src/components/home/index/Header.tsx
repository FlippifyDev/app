import { useUser } from '@/src/hooks/useUser';
import { IListing, IOrder } from '@/src/models/store-data';
import { Colors } from '@/src/theme/colors';
import { Text } from '@ui-kitten/components';
import CurrencyList from 'currency-list';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Price from '../../ui/Price';

const Header = ({ listingItems, activeItems, orderItems, currentTab }: { listingItems: IListing[], activeItems: IOrder[], orderItems: IOrder[], currentTab: string; }) => {
    const user = useUser();
    const [total, setTotal] = useState<number>(0);
    const [currencySymbol, setCurrencySymbol] = useState<string>("$");
    const [profit, setProfit] = useState<number>();

    useEffect(() => {
        setProfit(undefined);
        let newTotal = 0;
        let newProfit = 0;

        switch (currentTab) {
            case 'Inventory':
                // Total value of inventory
                newTotal = listingItems.reduce(
                    (sum, item) => sum + (item.price || 0),
                    0
                );
                // No profit when just viewing inventory
                newProfit = 0;
                break;

            case 'Active':
                // Sum of sale prices of active listings
                newTotal = activeItems.reduce(
                    (sum, item) => sum + (item.sale?.price || 0),
                    0
                );
                // Potential profit = (sale price - purchase price) for each active order
                newProfit = activeItems.reduce(
                    (sum, item) =>
                        sum +
                        ((item.sale?.price || 0) - (item.purchase?.price || 0) - (item.tax?.amount || 0) - (item.additionalFees || 0) - (item.shipping?.sellerFees || 0)),
                    0
                );
                break;

            case 'Orders':
                // Sum of sale prices of completed orders
                newTotal = orderItems.reduce(
                    (sum, item) => sum + (item.sale?.price || 0),
                    0
                );
                // Realized profit = sale price minus cost for each order
                newProfit = orderItems.reduce(
                    (sum, item) =>
                        sum +
                        ((item.sale?.price || 0) - (item.purchase?.price || 0) - (item.tax?.amount || 0) - (item.additionalFees || 0) - (item.shipping?.sellerFees || 0)),
                    0
                );
                break;

            default:
                newTotal = 0;
                newProfit = 0;
        }

        setTotal(newTotal);
        setProfit(newProfit);

        // Set currency symbol from user preferences
        if (user) {
            const currency = user.preferences?.currency ?? 'USD';
            setCurrencySymbol(
                CurrencyList.get(currency)?.symbol_native || currency
            );
        }
    }, [
        listingItems,
        activeItems,
        orderItems,
        currentTab,
        user,
    ]);

    return (
        <View style={styles.container}>
            <Price price={total} currencySymbol={currencySymbol} baseSize={26} style={{ fontWeight: "bold" }} />
            {(profit !== undefined && currentTab !== "Inventory") && (
                <Text style={styles.summary}>
                    <Price price={profit} currencySymbol={currencySymbol} baseSize={20} showSymbol style={{ color: Colors.houseBlue }} />
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 25,
    },
    summary: {
        fontSize: 16,
        color: Colors.text,
        marginBottom: 4,
    },
});

export default Header;