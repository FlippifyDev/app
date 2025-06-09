import { Colors } from '@/src/theme/colors';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { Stack } from "expo-router";
import { View } from 'react-native';

export default function RootLayout() {
    return (
        <ApplicationProvider {...eva} theme={eva.dark}>
            <View style={{ flex: 1, paddingTop: 32, backgroundColor: Colors.background }}>
                <Stack />
            </View>
        </ApplicationProvider>
    );
}
