import { Stack } from 'expo-router';


const StoreLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="inventory-item" />
            <Stack.Screen name="order-item" />
        </Stack>
    );
};




export default StoreLayout;