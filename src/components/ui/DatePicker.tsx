import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '@/src/theme/colors';

interface Props {
    label?: string;
    value: Date;
    onChange: (date: Date) => void;
}

const DatePicker: React.FC<Props> = ({ label, value, onChange }) => {
    const handleChange = (_: any, selectedDate?: Date) => {
        if (selectedDate) onChange(selectedDate);
    };

    return (
        <View style={{ flex: 1 }}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={styles.pickerContainer}>
                <DateTimePicker
                    value={value}
                    mode="date"
                    display="default"
                    onChange={handleChange}
                    style={styles.picker}
                />
            </View>
        </View>
    );
};

export default DatePicker;

const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textSecondary,
        marginTop: 12,
        marginBottom: 4,
    },
    pickerContainer: {
        height: 48,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: Colors.background,
        justifyContent: 'center',
    },
    picker: {
        flex: 1,
    },
});
