import ListingEditor from '@/src/components/home/add-listing/ListingEditor';
import { SubScreenLayout } from '@/src/components/ui/SubScreenLayout';
import { Colors } from '@/src/theme/colors';
import { useGlobalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function AddListingScreen() {
    const { marketItem, cacheKey } = useGlobalSearchParams();
    const [parsedItem, setParsedListing] = useState<any | null>(null);


    useEffect(() => {
        if (typeof marketItem === 'string') {
            try {
                const parsed = JSON.parse(marketItem);
                setParsedListing(parsed);
            } catch (err) {
                console.error('Invalid listing JSON:', err);
            }
        }
    }, [marketItem]);

    if (!parsedItem || !cacheKey) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>Invalid or missing listing data.</Text>
            </View>
        );
    }

    return (
        <SubScreenLayout>
            <ListingEditor marketItem={parsedItem} cacheKey={JSON.parse(cacheKey as string)} />
        </SubScreenLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    errorText: {
        color: Colors.text,
        fontSize: 16,
    },
});
