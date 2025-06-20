// TimeRangeSelector.tsx
import { Colors } from '@/src/theme/colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type RangeKey = '1D' | '1W' | 'TW' | `TM` | '1M' | '3M';

interface Props {
    /** Currently selected range */
    selected: RangeKey;
    /** Called when user picks a new range */
    onChange: (range: RangeKey) => void;
    /** Optional override of the available ranges */
    options?: RangeKey[];
}

const DEFAULT_OPTIONS: RangeKey[] = ['1D', '1W', 'TW', 'TM', '1M', '3M'];

const TimeRangeSelector: React.FC<Props> = ({
    selected,
    onChange,
    options = DEFAULT_OPTIONS,
}) => {
    return (
        <View style={styles.container}>
            {options.map((opt) => {
                const isActive = opt === selected;
                return (
                    <TouchableOpacity
                        key={opt}
                        style={[
                            styles.button,
                        ]}
                        onPress={() => onChange(opt)}
                        activeOpacity={0.7}
                    >
                        <Text
                            style={[
                                styles.label,
                                isActive && styles.labelActive,
                            ]}
                        >
                            {opt}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

export default TimeRangeSelector;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginVertical: 8,
    },
    button: {
        paddingVertical: 6,
        borderRadius: 4,
        backgroundColor: Colors.background,
    },
    label: {
        fontSize: 12,
        fontWeight: '500',
        color: Colors.textSecondary,
        padding: 12,
        paddingHorizontal: 16,
    },
    labelActive: {
        backgroundColor: Colors.cardBackground,
        borderRadius: 12,
        color: Colors.text,
        fontWeight: "bold"
    },
});
