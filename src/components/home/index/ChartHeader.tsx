import { useUser } from '@/src/hooks/useUser';
import { IOrder } from '@/src/models/store-data';
import { Colors } from '@/src/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@ui-kitten/components';
import CurrencyList from 'currency-list';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Price from '../../ui/Price';
import { useRouter } from 'expo-router';

const ChartHeader = ({ orderItems, hoverInfo, selectedRange }: { orderItems: IOrder[], hoverInfo?: { value?: number, index?: number }; selectedRange: string; }) => {
    const user = useUser();
    const router = useRouter();
    const [currencySymbol, setCurrencySymbol] = useState<string>("$");
    const [profit, setProfit] = useState<number>();
    const [total, setTotal] = useState<number>();
    const [profitText, setProfitText] = useState<string>();

    useEffect(() => {
        function handleRangeChange() {
            switch (selectedRange) {
                case '1D':
                    setProfitText("LAST 24H");
                    break;
                case '1W':
                    setProfitText("LAST WEEK");
                    break;
                case 'TW':
                    setProfitText("THIS WEEK");
                    break;
                case 'TM': // This Month
                    setProfitText("THIS MONTH");
                    break;
                case '1M':
                    setProfitText("LAST MONTH");
                    break;
                case '3M':
                    setProfitText("LAST 3 MONTHS");
                    break;
            }
        };
        handleRangeChange()
    }, [selectedRange])


    useEffect(() => {
        if (hoverInfo && hoverInfo.value !== undefined) {
            setTotal(hoverInfo?.value);
            setProfit(0);
            return;
        }
        setProfit(undefined);
        let newTotal = 0;
        let newProfit = 0;

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
        orderItems,
        user,
        hoverInfo,
        selectedRange,
    ]);


    function handleAddIconPress() {
        router.push("/home/add/listing")
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>Revenue</Text>
                <TouchableOpacity style={styles.plusIcon} onPress={handleAddIconPress}>
                    <Ionicons name="add" size={32} color={Colors.background} />
                </TouchableOpacity>
            </View>
            <Price price={total ?? 0} currencySymbol={currencySymbol} baseSize={36} />
            <View style={styles.profitContainer}>
                <Text style={styles.profitText}>{profitText}</Text>
                <Text style={styles.summary}>
                    <Price price={profit ?? 0} currencySymbol={currencySymbol} baseSize={18} showSymbol style={{ color: ((profit ?? 0) > 0 ? Colors.houseBlue : Colors.red), fontWeight: "bold" }} />
                </Text>
            </View>
            <View>

            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "space-between",
        width: "100%",
        flexDirection: "column",
        marginTop: 18,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    plusIcon: {
        backgroundColor: Colors.houseBlue,
        borderRadius: 9999,
        padding: 8,
        marginTop: 10
    },
    title: {
        color: Colors.text,
        fontSize: 28,
        marginBottom: 20,
    },
    summary: {
        fontSize: 18,
        marginTop: 4
    },
    profitContainer: {
        marginTop: 18,
    },
    profitText: {
        fontSize: 12,
        color: Colors.textSecondary,
    }
});

export default ChartHeader;