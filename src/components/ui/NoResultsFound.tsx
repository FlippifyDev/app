import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/src/theme/colors';

export default function NoResultsFound() {
    return (
        <View style={styles.container}>
            <View style={styles.iconWrapper}>
                <Ionicons name="search" size={32} color={Colors.houseBlue} />
            </View>
            <Text style={styles.title}>No results found</Text>
            <Text style={styles.subtitle}>
                We couldn&apos;t find any results, try searching for something else or adding a new item.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: 8, 
        textAlign: 'center',
    },
    iconWrapper: {
        marginBottom: 12,
    },
    title: {
        fontWeight: '600',
        fontSize: 18,
        color: Colors.text
    },
    subtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        fontWeight: '500',
        textAlign: 'center',
    },
});
