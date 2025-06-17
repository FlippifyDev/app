import { Stack } from 'expo-router';


const CompareResultsLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="add-listing" />
        </Stack>
    );
};




export default CompareResultsLayout;