import { Colors } from '@/src/theme/colors';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

export type TimeFilterOption = 'today' | 'this-week' | 'this-month' | 'last-30-days' | 'last-90-days';

export interface TimeRange {
    timeFrom: Date;
    timeTo: Date;
}

interface TimeFilterProps {
    onTimeRangeChange: (timeRange: TimeRange) => void;
}

const filterOptions: { label: string; value: TimeFilterOption }[] = [
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'this-week' },
    { label: 'This Month', value: 'this-month' },
    { label: 'Last 30 Days', value: 'last-30-days' },
    { label: 'Last 90 Days', value: 'last-90-days' },
];

const calculateTimeRange = (filter: TimeFilterOption): TimeRange => {
    const now = new Date();
    const timeTo = new Date(now);
    timeTo.setHours(23, 59, 59, 999); // End of the day

    let timeFrom: Date;

    switch (filter) {
        case 'today':
            timeFrom = new Date(now);
            timeFrom.setHours(0, 0, 0, 0);
            break;
        case 'this-week':
            timeFrom = new Date(now);
            timeFrom.setDate(now.getDate() - now.getDay());
            timeFrom.setHours(0, 0, 0, 0);
            break;
        case 'this-month':
            timeFrom = new Date(now.getFullYear(), now.getMonth(), 1);
            timeFrom.setHours(0, 0, 0, 0);
            break;
        case 'last-30-days':
            timeFrom = new Date(now);
            timeFrom.setDate(now.getDate() - 30);
            timeFrom.setHours(0, 0, 0, 0);
            break;
        case 'last-90-days':
            timeFrom = new Date(now);
            timeFrom.setDate(now.getDate() - 90);
            timeFrom.setHours(0, 0, 0, 0);
            break;
        default:
            timeFrom = new Date(now.getFullYear(), now.getMonth(), 1);
            timeFrom.setHours(0, 0, 0, 0);
            break;
    }

    return { timeFrom, timeTo };
};

const TimeFilter: React.FC<TimeFilterProps> = ({ onTimeRangeChange }) => {
    const [selectedFilter, setSelectedFilter] = useState<TimeFilterOption>('this-month');

    useEffect(() => {
        const timeRange = calculateTimeRange(selectedFilter);
        onTimeRangeChange(timeRange);
    }, [selectedFilter, onTimeRangeChange]);

    return (
        <View style={styles.container}>
            <Dropdown
                style={styles.dropdown}
                containerStyle={styles.dropdownContainer}
                itemTextStyle={styles.itemText}
                selectedTextStyle={styles.selectedText}
                data={filterOptions}
                labelField="label"
                valueField="value"
                value={selectedFilter}
                onChange={(item) => setSelectedFilter(item.value as TimeFilterOption)}
                placeholder="Select time range"
                placeholderStyle={styles.placeholder}
                accessibilityLabel="Time filter dropdown"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        maxWidth: 180,
        backgroundColor: Colors.background,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 8,
    },
    dropdown: {
        height: 44,
        borderRadius: 8,
        backgroundColor: Colors.background,
        paddingHorizontal: 12,
    },
    dropdownContainer: {
        borderRadius: 8,
        borderWidth: 1,
        backgroundColor: Colors.background,
    },
    itemText: {
        fontSize: 16,
        color: Colors.text,
    },
    selectedText: {
        fontSize: 16,
        color: Colors.text,
    },
    placeholder: {
        fontSize: 16,
        color: Colors.text + '80',
    },
});

export default TimeFilter;