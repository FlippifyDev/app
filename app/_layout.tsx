import { Colors } from '@/src/theme/colors';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { Stack } from "expo-router";
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
    return (
        <ApplicationProvider {...eva} theme={eva.dark}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: Colors.background }}>
                    <Stack screenOptions={{ headerShown: false }} />
                </View>
            </GestureHandlerRootView>
        </ApplicationProvider>
    );
}
