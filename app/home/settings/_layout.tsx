import { Stack } from 'expo-router';


const SettingsLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="connected-accounts" />
            <Stack.Screen name="subscription" />
            <Stack.Screen name="plans" />
            <Stack.Screen name="socials" />
        </Stack>
    );
};




export default SettingsLayout;