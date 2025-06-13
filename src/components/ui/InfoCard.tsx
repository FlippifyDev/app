import { Colors } from '@/src/theme/colors';
import { Text } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Card from './Card';

interface InfoCardProps {
    title: string;
    body: string;
}

const InfoCard = ({ title, body }: InfoCardProps) => {
    return (
        <Card style={{ width: "48%" }}>
            <View style={styles.cardContainer}>
                <Text category="h1" style={styles.body}>{body}</Text>
                <Text category="label" appearance="hint" style={styles.title}>
                    {title}
                </Text>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: "column",
        padding: 8,
    },
    title: {
        marginBottom: 4,
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: Colors.houseBlue,
    },
    body: {
        marginBottom: 4,
        fontSize: 28,
        letterSpacing: 1,
        color: Colors.text,
    },
});

export default InfoCard;
