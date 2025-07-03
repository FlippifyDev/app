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
import { calculateOrderProfit } from '@/src/utils/calculate';

const ChartHeader = ({ orderItems, hoverInfo, selectedRange }: { orderItems: IOrder[], hoverInfo?: { value?: number, profit?: number }; selectedRange: string; }) => {
    const user = useUser();
    const router = useRouter();
    const [currencySymbol, setCurrencySymbol] = useState<string>("$");
    const [profit, setProfit] = useState<number>();
    const [total, setTotal] = useState<number>();
    const [profitText, setProfitText] = useState<string>();

    const getRangeText = (range: string) => {
        switch (range) {
            case '1D':
                return "LAST 24H";
            case '1W':
                return "LAST WEEK";
            case 'TW':
                return "THIS WEEK";
            case 'TM':
                return "THIS MONTH";
            case '1M':
                return "LAST MONTH";
            case '3M':
                return "LAST 3 MONTHS";
            default:
                return "LAST 24H";
        }
    };



    useEffect(() => {
        if (hoverInfo && hoverInfo.value !== undefined) {
            setTotal(hoverInfo?.value);
            setProfit(hoverInfo?.profit);
            setProfitText("Profit");
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
                sum + calculateOrderProfit({ item }),
            0
        );


        setTotal(newTotal);
        setProfit(newProfit);

        setProfitText(getRangeText(selectedRange));

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
                    <Price price={profit ?? 0} currencySymbol={currencySymbol} baseSize={18} showSymbol style={{ color: ((profit ?? 0) > 0 ? Colors.houseBlue : profit === 0 ? Colors.text : Colors.red), fontWeight: "bold" }} />
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