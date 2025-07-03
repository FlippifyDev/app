import { Colors } from '@/src/theme/colors';
import { Text } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface Props {
    rows: { label: string; value?: string | number | null }[];
}
export const Section: React.FC<Props> = ({ rows }) => {
    if (!rows.length) return null;

    return (
        <View style={styles.section}>
            {rows.map((row, idx) => (
                <Row
                    key={idx}
                    label={row.label}
                    value={row.value}
                />
            ))}
        </View>
    )
}

const Row: React.FC<{ label: string; value?: string | number | null }> = ({
    label,
    value,
}) => (
    <View style={styles.row}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value ?? 'N/A'}</Text>
    </View>
);

export default Section

const styles = StyleSheet.create({
    section: { 
        marginTop: 16, 
        backgroundColor: Colors.lightGray ,
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 16
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    rowLabel: {
        fontWeight: '500',
        color: Colors.background,
        fontSize: 16
    },
    rowValue: { flex: 1, textAlign: 'right', color: Colors.background },
});
