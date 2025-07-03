import { Colors } from '@/src/theme/colors';
import { formatDate } from '@/src/utils/format';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FModal from './FSlideModal';

interface Props {
    label?: string;
    value: Date;
    onChange: (date: Date) => void;
}

const DatePicker: React.FC<Props> = ({ label, value, onChange }) => {
    const [showPicker, setShowPicker] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const slideAnim = useRef(new Animated.Value(500)).current;

    useEffect(() => {
        if (showPicker) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            slideAnim.setValue(500);
        }
    }, [showPicker, slideAnim]);

    const handleChange = (_: any, selectedDate?: Date) => {
        setShowPicker(Platform.OS === 'ios'); // Keep picker open on iOS
        if (selectedDate) {
            onChange(selectedDate);
        }
        closePicker();
    };

    const togglePicker = () => {
        setShowPicker(true);
        setIsFocused(true);
    };

    const closePicker = () => {
        setShowPicker(false);
        setIsFocused(false);
    };

    const showLabel = isFocused || value !== undefined;

    return (
        <View style={styles.container}>
            <View style={styles.wrapper}>
                {label && showLabel && (
                    <Text style={styles.floatingLabel}>{label}</Text>
                )}
                <TouchableOpacity onPress={togglePicker} style={styles.pickerContainer}>
                    <Text
                        style={[
                            styles.dateText,
                            showLabel && styles.dateTextWithLabel,
                            !value && styles.placeholderText,
                        ]}
                    >
                        {value ? formatDate(value.toDateString()) : 'Select a date'}
                    </Text>
                </TouchableOpacity>
                {showPicker && Platform.OS === 'ios' && (
                    <FModal
                        visible={showPicker}
                        onRequestClose={closePicker}
                        onClose={closePicker}
                    >
                        <View style={{ alignItems: "center" }}>
                            <DateTimePicker
                                value={value || new Date()}
                                mode="date"
                                display="inline"
                                onChange={handleChange}
                                style={[styles.pickerIOS, { transform: [{ scale: 0.9 }] }]}
                                textColor={Colors.textSecondary}
                                accentColor={Colors.houseBlue}
                                themeVariant='light'
                            />
                        </View>
                    </FModal>
                )}
                {showPicker && Platform.OS === 'android' && (
                    <DateTimePicker
                        value={value || new Date()}
                        mode="date"
                        display="default"
                        onChange={handleChange}
                        style={{ transform: [{ scale: 0.9 }] }}
                        textColor={Colors.textSecondary}
                        accentColor={Colors.houseBlue}
                        themeVariant='light'
                    />
                )}
            </View>
        </View>
    );
};

export default DatePicker;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapper: {
        height: 56,
        position: 'relative',
    },
    floatingLabel: {
        position: 'absolute',
        top: 8,
        left: 12,
        fontSize: 12,
        fontWeight: '600',
        color: Colors.textSecondary,
        zIndex: 1,
    },
    pickerContainer: {
        height: 58,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 12,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        paddingHorizontal: 12,
    },
    dateText: {
        fontSize: 16,
        color: Colors.text,
    },
    dateTextWithLabel: {
        paddingTop: 20,
        paddingBottom: 4,
    },
    placeholderText: {
        color: Colors.textPlaceholder,
    },
    pickerIOS: {
        backgroundColor: Colors.background,
        width: '100%',
    },
});