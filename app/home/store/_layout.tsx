import { Stack } from 'expo-router';


const StoreLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="index" />
        </Stack>
    );
};




export default StoreLayout;