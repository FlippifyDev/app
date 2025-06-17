import React from 'react';
import { StyleSheet, Text, TextStyle, View } from 'react-native';

interface Props {
    price: number;
    currencySymbol?: string;
    baseSize: number;
    style?: TextStyle;
    showSymbol?: boolean;
}

const Price: React.FC<Props> = ({ price, currencySymbol, baseSize, style, showSymbol }) => {
    // Format price to two decimals
    const [intPart, decPart] = price.toFixed(2).split('.');


    return (
        <View style={styles.container}>
            <Text style={[styles.priceText, style]} accessibilityRole="text">
                <Text style={{ fontSize: baseSize * 0.7, lineHeight: baseSize }}>{showSymbol ? (price >= 0 ? "+" : "-") : ""}</Text>
                {currencySymbol && (
                    <Text style={{ fontSize: baseSize * 0.7, lineHeight: baseSize }}>{currencySymbol}</Text>
                )}
                <Text style={{ fontSize: baseSize, lineHeight: baseSize }}>{intPart}</Text>
                <Text style={{ fontSize: baseSize * 0.7, lineHeight: baseSize }}>.{decPart}</Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    priceText: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    } as TextStyle,
});

export default Price;
