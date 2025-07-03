import { useUser } from '@/src/hooks/useUser';
import { IChartData } from '@/src/models/chart';
import { IOrder } from '@/src/models/store-data';
import { retrieveOrders } from '@/src/services/bridges/retrieve';
import { Colors } from '@/src/theme/colors';
import { calculateOrderProfit } from '@/src/utils/calculate';
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

function aggregateOrdersByDate(items: IOrder[], timeRange: TimeRange): IChartData[] {
    const map = new Map<string, number>();
    const orderMap = new Map<string, IOrder>();

    // Populate totals for dates that have data
    items.forEach(item => {
        if (!item.sale?.date) return;
        const day = new Date(item.sale.date).toISOString().slice(0, 10);
        map.set(day, (map.get(day) || 0) + (item.sale.price || 0));
        orderMap.set(day, item);
    });

    // Build full list of date strings between timeFrom and timeTo (+1 day)
    const labels: string[] = [];
    const dataPoints: number[] = [];
    const data: IOrder[] = [];

    const d = new Date(timeRange.timeFrom);
    const end = new Date(timeRange.timeTo);

    while (d <= end) {
        // Calculate the *display* day as one day ahead
        const displayDate = new Date(d);
        displayDate.setDate(displayDate.getDate() + 1);

        const dayLabel = displayDate.toISOString().slice(0, 10);
        labels.push(dayLabel);

        // But you still map & pull data using the *original* day key:
        const key = d.toISOString().slice(0, 10);
        dataPoints.push(map.get(key) ?? 0);
        data.push(orderMap.get(key) ?? ({} as IOrder));

        // Move to next day
        d.setDate(d.getDate() + 1);
    }

    // Transform into chart format
    return labels.map((label, index) => ({
        value: dataPoints[index],
        time: new Date(label).getTime(),
        profit: calculateOrderProfit({ item: data[index] }),
    }));
}

const Home = () => {
    const user = useUser();
    const [items, setItems] = useState<IOrder[]>();
    const [hoverInfo, setHoverInfo] = useState<{ value?: number, profit?: number }>();
    
    const now = new Date();
    const [timeRange, setTimeRange] = useState({ timeFrom: new Date(now.getFullYear(), now.getMonth(), 1), timeTo: new Date() });
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
                const day = now.getDay();
                const diff = (day === 0 ? 6 : day - 1);
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

    function setY(value?: number, profit?: number) {
        setHoverInfo({ value, profit })
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
                <Chart chartData={chartData} setY={setY} />
                {/*<Chart data={chartData} setHoverInfo={handleHoverInfoChange} />*/}
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
    scrollContainer: { 
        flexGrow: 1 
    },
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
        marginBottom: 30,
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