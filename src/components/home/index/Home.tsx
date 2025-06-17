import { IListing, IOrder } from '@/src/models/store-data';
import { Colors } from '@/src/theme/colors';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import TimeFilter from '../../ui/TimeFilter';
import Active from './Active';
import Header from './Header';
import Inventory from './Inventory';
import Orders from './Orders';

export type RootTabParamList = {
    Inventory: undefined;
    Active: undefined;
    Orders: undefined;
};

const Tab = createMaterialTopTabNavigator<RootTabParamList>();

const Home = () => {
    const [listingItems, setListingItems] = useState<IListing[]>();
    const [activeItems, setActiveItems] = useState<IOrder[]>();
    const [orderItems, setOrderItems] = useState<IOrder[]>();
    const tabs: Record<number, string> = {
        0: "Inventory",
        1: "Active",
        2: "Orders",
    }
    const [currentTab, setCurrentTab] = useState('Inventory');
    const [timeRange, setTimeRange] = useState({ timeFrom: new Date(), timeTo: new Date() });

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TimeFilter onTimeRangeChange={setTimeRange} />
                <Header listingItems={listingItems ?? []} activeItems={activeItems ?? []} orderItems={orderItems ?? []} currentTab={currentTab} />
            </View>
            <StatusBar barStyle="dark-content" />
            <Tab.Navigator
                initialRouteName="Inventory"
                screenOptions={{
                    tabBarIndicatorStyle: styles.indicator,
                    tabBarLabelStyle: styles.label,
                    tabBarStyle: styles.tabBar,
                }}
                onTabSelect={(index) => {
                    setCurrentTab(tabs[index.index]);
                }}
            >
                <Tab.Screen name="Inventory">
                    {() => (
                        <Inventory
                            setRootItems={setListingItems}
                            timeFilter={timeRange}
                        />
                    )}
                </Tab.Screen>
                <Tab.Screen name="Active">
                    {() => (
                        <Active
                            setRootItems={setActiveItems}
                            timeFilter={timeRange}
                        />
                    )}
                </Tab.Screen>
                <Tab.Screen name="Orders">
                    {() => (
                        <Orders
                            setRootItems={setOrderItems}
                            timeFilter={timeRange}
                        />
                    )}
                </Tab.Screen>
            </Tab.Navigator>
        </SafeAreaView>
    )
}

export default Home;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
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