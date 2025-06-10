import { Colors } from '@/src/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Stack, usePathname, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import HomeScreen from '.';
import CameraScannerScreen from './camera-scanner';
import CompareScreen from './compare-result';
import SettingsScreen from './settings';

const Tab = createBottomTabNavigator();

const CustomTabBar = (props: any) => {
    const pathname = usePathname();
    const router = useRouter();
    const isActive = (route: string) => pathname === route;

    function handleTabClick(route: "/home" | "/home/settings" | "/home/camera-scanner") {
        console.log(route)
        if (!isActive(route)) router.push(route);
    }

    return (
        <View style={styles.tabBar}>
            <TouchableOpacity style={styles.tabButton} onPress={() => handleTabClick('/home')}>
                <Ionicons
                    name={isActive('/home') ? 'home-sharp' : 'home-outline'}
                    size={28}
                    color={Colors.icon}
                />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.tabButton}
                onPress={() => handleTabClick("/home/camera-scanner")}
            >
                <Ionicons name="camera-outline" size={32} color={Colors.icon} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.tabButton} onPress={() => handleTabClick('/home/settings')}>
                <Ionicons
                    name={isActive('/home/settings') ? 'settings-sharp' : 'settings-outline'}
                    size={28}
                    color={Colors.icon}
                />
            </TouchableOpacity>
        </View>
    );
};

const ScreenLayout = ({ children }: { children: React.ReactNode }) => {
    return <View style={styles.screen}>{children}</View>;
};

const HomeLayout = () => {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <Tab.Navigator
                tabBar={() => <CustomTabBar />}
                screenLayout={ScreenLayout}
            >
                <Tab.Screen
                    name="index"
                    component={HomeScreen}
                    options={{
                        headerShown: false,
                    }}
                />
                <Tab.Screen
                    name="camera-scanner"
                    component={CameraScannerScreen}
                    options={{
                        headerShown: false,
                    }}
                />
                <Tab.Screen
                    name="settings"
                    component={SettingsScreen}
                    options={{
                        headerShown: false,
                    }}
                />
                <Tab.Screen
                    name="compare-result"
                    component={CompareScreen}
                    options={{
                        headerShown: false,
                    }}
                />
            </Tab.Navigator>
        </>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: "row",
        justifyContent: "center",
        paddingTop: 12,
        alignItems: "flex-start",
        elevation: 5,
        height: 80,
        backgroundColor: Colors.background
    },
    tabButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }, screen: {
        paddingTop: 16,
        backgroundColor: Colors.background,
        flex: 1,
    },
});

export default HomeLayout;
