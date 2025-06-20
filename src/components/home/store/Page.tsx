import { Colors } from '@/src/theme/colors';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TimeRange } from '../../ui/TimeFilter';
import { RootTabParamList } from '../index/Home';
import Active from './Active';
import Inventory from './Inventory';
import Orders from './Orders';

const Tab = createMaterialTopTabNavigator<RootTabParamList>();

const Page = () => {
    const now = new Date();
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(now.getDate() - 90);

    const timeRange: TimeRange = { timeFrom: ninetyDaysAgo, timeTo: new Date() }

    return (
        <View style={styles.safeArea}>
            <Tab.Navigator
                initialRouteName="Inventory"
                screenOptions={{
                    tabBarIndicatorStyle: styles.indicator,
                    tabBarLabelStyle: styles.label,
                    tabBarStyle: styles.tabBar,
                }}
            >
                <Tab.Screen name="Inventory">
                    {() => (
                        <Inventory
                            timeFilter={timeRange}
                        />
                    )}
                </Tab.Screen>
                <Tab.Screen name="Active">
                    {() => (
                        <Active
                            timeFilter={timeRange}
                        />
                    )}
                </Tab.Screen>
                <Tab.Screen name="Orders">
                    {() => (
                        <Orders
                            timeFilter={timeRange}
                        />
                    )}
                </Tab.Screen>
            </Tab.Navigator>
        </View>
    )
}


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
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

export default Page
