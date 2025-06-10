import { Colors } from '@/src/theme/colors';
import { Card, Text } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet } from 'react-native';

interface InfoCardProps {
    title: string;
    body: string;
}

const InfoCard = ({ title, body }: InfoCardProps) => {
    return (
        <Card style={styles.card}>
            <Text category="h1" style={styles.body}>{body}</Text>
            <Text category="label" appearance="hint" style={styles.title}>
                {title}
            </Text>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        width: "48%",
        marginVertical: 8,
        borderRadius: 12,
        borderWidth: 0,
        backgroundColor: Colors.cardBackground
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
        fontSize: 30,
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: Colors.text,
    },
});

export default InfoCard;
