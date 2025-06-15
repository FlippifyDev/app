import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import Inventory from './Inventory';
import Orders from './Orders';
import Active from './Active';
import { Colors } from '@/src/theme/colors';

export type RootTabParamList = {
    Inventory: undefined;
    Active: undefined;
    Orders: undefined;
};

const Tab = createMaterialTopTabNavigator<RootTabParamList>();

const Home = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <Tab.Navigator
                initialRouteName="Inventory"
                screenOptions={{
                    tabBarIndicatorStyle: styles.indicator,
                    tabBarLabelStyle: styles.label,
                    tabBarStyle: styles.tabBar,
                }}
            >
                <Tab.Screen name="Inventory" component={Inventory} />
                <Tab.Screen name="Active" component={Active} />
                <Tab.Screen name="Orders" component={Orders} />
            </Tab.Navigator>
        </SafeAreaView>
    )
}

export default Home;

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