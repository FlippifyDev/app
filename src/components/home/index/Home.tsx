import { useUser } from '@/src/hooks/useUser';
import { IOrder } from '@/src/models/store-data';
import { retrieveOrders } from '@/src/services/bridges/retrieve';
import { Colors } from '@/src/theme/colors';
import { formatDateToISO } from '@/src/utils/format';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Chart from '../../ui/Chart';
import { TimeRange } from '../../ui/TimeFilter';
import ChartHeader from './ChartHeader';
import Header from './Header';
import TimeRangeSelector, { RangeKey } from './TimeSelection';

export type RootTabParamList = {
    Inventory: undefined;
    Active: undefined;
    Orders: undefined;
};


function aggregateOrdersByDate(items: IOrder[], timeRange: TimeRange) {
    const map = new Map<string, number>();

    // Populate totals for dates that have data
    items.forEach(item => {
        if (!item.sale?.date) return;
        const day = new Date(item.sale.date).toISOString().slice(0, 10);
        map.set(day, (map.get(day) || 0) + (item.sale.price || 0));
    });

    // Build full list of date strings between timeFrom and timeTo
    const labels: string[] = [];
    const dataPoints: number[] = [];
    {
        const d = new Date(timeRange.timeFrom);
        const end = new Date(timeRange.timeTo);
        while (d <= end) {
            const day = d.toISOString().slice(0, 10);
            labels.push(day);
            dataPoints.push(map.get(day) ?? 0); // Use 0 if no data for the day
            d.setDate(d.getDate() + 1);
        }
    }

    // Transform data into the format expected by react-native-gifted-charts
    const chartData = labels.map((label, index) => ({
        value: dataPoints[index],
        label,

    }));

    return chartData;
}

const Home = () => {
    const user = useUser();
    const [items, setItems] = useState<IOrder[]>();
    const [hoverInfo, setHoverInfo] = useState<{ value?: number, index?: number }>();

    const [timeRange, setTimeRange] = useState({ timeFrom: new Date(), timeTo: new Date() });
    const [selectedRange, setSelectedRange] = useState<RangeKey>('TM');

    const chartData = React.useMemo(() => {
        return aggregateOrdersByDate(items ?? [], timeRange);
    }, [items, timeRange]);

    useEffect(() => {
        async function fetchItems() {
            if (!user) return;

            const items = await retrieveOrders({ uid: user.id as string, timeFrom: formatDateToISO(timeRange.timeFrom), timeTo: formatDateToISO(timeRange.timeTo) })
            const activeItems = (items ?? []).filter(item => item.status !== 'Active');
            setItems(activeItems);

        }

        if ((user?.authentication?.subscribed)) {
            fetchItems();
        }
    }, [user, timeRange]);

    const handleRangeChange = (range: RangeKey) => {
        const now = new Date();
        let from = new Date(now);

        switch (range) {
            case '1D':
                from.setDate(now.getDate() - 1);
                break;
            case '1W':
                from.setDate(now.getDate() - 7);
                break;
            case 'TW':
                const day = now.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
                const diff = (day === 0 ? 6 : day - 1); // Number of days to subtract to get Monday
                from.setDate(now.getDate() - diff);
                break;
            case 'TM': // This Month
                from = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case '1M':
                from.setMonth(now.getMonth() - 1);
                break;
            case '3M':
                from.setMonth(now.getMonth() - 3);
                break;
        }

        setSelectedRange(range);
        setTimeRange({ timeFrom: from, timeTo: now });
    };

    function handleHoverInfoChange(value?: number, index?: number) {
        setHoverInfo({ value, index })
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Header />
            </View>
            <ScrollView style={{ flex: 1 }} scrollEnabled={!hoverInfo?.value}>
                <View style={styles.chartHeader}>
                    <ChartHeader orderItems={items ?? []} hoverInfo={hoverInfo} selectedRange={selectedRange} />
                </View>
                <Chart data={chartData} setHoverInfo={handleHoverInfoChange} />
                <TimeRangeSelector
                    selected={selectedRange}
                    onChange={handleRangeChange}
                    options={['1D', '1W', 'TW', 'TM', '1M', '3M']}
                />
            </ScrollView>
        </SafeAreaView>
    )
}

export default Home;

const styles = StyleSheet.create({
    scrollContainer: { flexGrow: 1 },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingBottom: 10,
        width: "100%",
    },
    chartHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        width: "100%",
    },
    tabBar: {
        backgroundColor: Colors.background,
    },
    indicator: {
        backgroundColor: Colors.background,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
    },
});