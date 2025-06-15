import { Colors } from '@/src/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Tabs, usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Platform, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import HomeScreen from '.';
import AddListing from './add-listing';
import CameraScannerScreen from './camera-scanner';
import CompareScreen from './compare-result';
import RecentsScreen from './recents';
import SettingsScreen from './settings/index';

const Tab = createBottomTabNavigator();

const CustomTabBar = (props: any) => {
    const pathname = usePathname();
    const router = useRouter();
    const isActive = (route: string) => pathname.includes(route)


    function handleTabClick(route: "/home/index" | "/home/settings" | "/home/camera-scanner" | "/home/recents") {
        const validRoute = route.replace("/index", "") as "/home" | "/home/settings" | "/home/camera-scanner" | "/home/recents";
        if (!isActive(route)) router.push(validRoute);
    }

    return (
        <View style={styles.tabBar}>
            <TouchableOpacity style={styles.tabButton} onPress={() => handleTabClick('/home/index')}>
                <Ionicons
                    name={isActive('/home/index') ? 'home-sharp' : 'home-outline'}
                    size={28}
                    color={Colors.icon}
                />
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabButton} onPress={() => handleTabClick('/home/recents')}>
                <Ionicons
                    name={isActive('/home/recents') ? 'search' : 'search-outline'}
                    size={28}
                    color={Colors.icon}
                />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.tabButton}
                onPress={() => handleTabClick("/home/camera-scanner")}
            >
                <Ionicons
                    name={isActive('/home/camera-scanner') ? 'camera' : 'camera-outline'}
                    size={30}
                    color={Colors.icon}
                />
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
    return <SafeAreaView style={styles.screen}>{children}</SafeAreaView>;
};

const HomeLayout = () => {
    return (
        <Tabs
            tabBar={() => <CustomTabBar />}
            screenLayout={ScreenLayout}
            screenOptions={{ headerShown: false }}
        >
            <Tab.Screen
                name="index"
                component={HomeScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="recents"
                component={RecentsScreen}
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
            <Tab.Screen
                name="add-listing"
                component={AddListing}
                options={{
                    headerShown: false,
                }}
            />
        </Tabs>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: "row",
        justifyContent: "center",
        paddingBottom: 15,
        alignItems: "center",
        height: 80,
        backgroundColor: Colors.background,
        // Android: simple elevation (always casts downward)
        elevation: 5,

        // iOS: custom upward‐pointing shadow
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
        }),
    },
    tabButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    screen: {
        paddingTop: 16,
        backgroundColor: Colors.background,
        flex: 1,
    },
});

export default HomeLayout;
