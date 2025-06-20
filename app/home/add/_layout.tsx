import { Stack } from 'expo-router';


const AddLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="listing" />
        </Stack>
    );
};




export default AddLayout;