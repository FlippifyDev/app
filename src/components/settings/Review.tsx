import { Colors } from '@/src/theme/colors';
import { APPSTORE_ID, GOOGLE_PLAY_PACKAGE_NAME } from '@/src/utils/contants';
import { Text } from '@ui-kitten/components';
import * as StoreReview from 'expo-store-review';
import React, { useEffect, useState } from 'react';
import { Linking, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

const Review: React.FC = () => {
    const [isAvailable, setIsAvailable] = useState<boolean>(false);

    useEffect(() => {
        // Check availability on mount
        (async () => {
            const available = await StoreReview.isAvailableAsync();
            setIsAvailable(available);
        })();
    }, []);

    const onPressReview = async () => {
        if (isAvailable) {
            // Inline review dialog
            await StoreReview.requestReview();
        } else {
            // Fallback: open store listing
            const url = Platform.select({
                ios: `itms-apps://itunes.apple.com/app/${APPSTORE_ID}`,
                android: `market://details?id=${GOOGLE_PLAY_PACKAGE_NAME}`,
            });
            if (url) Linking.openURL(url);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={onPressReview}
                disabled={!isAvailable && !Platform.OS}
            >
                <Text style={styles.linkText}>Leave a Review</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    linkText: {
        fontSize: 14,
        color: Colors.textSecondary,
        textDecorationLine: 'underline',
    },
});

export default Review;
