import { Stack } from 'expo-router';


const RecentsLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="compare" />
        </Stack>
    );
};




export default RecentsLayout;