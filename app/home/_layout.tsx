import { Colors } from '@/src/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Platform, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';

const CustomTabBar = (props: any) => {
    const pathname = usePathname();
    const router = useRouter();

    const isActive = (route: string) => {
        if (route === '/home/index') {
            // Match /home/index exactly or any sub-route (e.g., /home/index/Inventory)
            return pathname === '/home' || pathname === '/home/index' || pathname.startsWith('/home/index/');
        }
        // For other routes, check if pathname starts with the route
        return pathname.startsWith(route);
    };

    function handleTabClick(route: '/home/index' | '/home/settings' | '/home/camera-scanner' | '/home/recents') {
        const validRoute = route.replace('/index', '') as '/home' | '/home/settings' | '/home/camera-scanner' | '/home/recents';
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

function ScreenLayout({ children }: { children: React.ReactNode }) {
    return <SafeAreaView style={styles.screen}>{children}</SafeAreaView>;
};


const HomeLayout = () => {
    return (
        <Tabs
            tabBar={() => <CustomTabBar />}
            screenLayout={ScreenLayout}
            screenOptions={{ headerShown: false }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="recents"
                options={{
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="camera-scanner"
                options={{
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="settings"
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
