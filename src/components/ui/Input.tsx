import { Colors } from "@/src/theme/colors";
import { Text } from "@ui-kitten/components";
import { useState } from "react";
import { Platform, StyleSheet, TextInput, TextInputProps, View } from "react-native";

interface InputProps extends TextInputProps {
    label?: string;
    adornment?: string; // the symbol or text to show
    adornmentPosition?: 'left' | 'right'; // where to show it
}

const Input: React.FC<InputProps> = ({
    label,
    adornment,
    adornmentPosition = 'left',
    style,
    ...rest
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const isLeft = adornment && adornmentPosition === 'left';
    const isRight = adornment && adornmentPosition === 'right';
    const showLabel = isFocused || (rest.value && rest.value.length > 0);

    return (
        <View style={styles.wrapper}>
            {showLabel && (
                <Text style={styles.floatingLabel}>{label}</Text>
            )}
            {isLeft && (
                <View style={[styles.adornmentWrapper]}>
                    <Text style={styles.adornment}>{adornment}</Text>
                </View>
            )}
            <TextInput
                style={[
                    styles.input,
                    isLeft && { paddingLeft: 22 },
                    isRight && { paddingRight: 22 },
                    showLabel && { paddingTop: 26 },
                    isFocused && styles.focusedInput,
                    style,
                ]}
                placeholderTextColor={isFocused ? Colors.background : Colors.textSecondary}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...rest}
            />
            {isRight && (
                <View style={[styles.adornmentWrapper]}>
                    <Text style={styles.adornment}>{adornment}</Text>
                </View>
            )}
        </View>
    );
};

export default Input;

const styles = StyleSheet.create({
    wrapper: {
        position: 'relative',
    },
    floatingLabel: {
        position: 'absolute',
        top: 8,
        left: 12,
        fontSize: 12,
        color: Colors.textSecondary,
        zIndex: 1,
        fontWeight: "bold"
    },
    input: {
        height: 58,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        backgroundColor: Colors.background,
    },
    focusedInput: {
        borderColor: Colors.houseHoverBlue,
        borderWidth: 2,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    adornmentWrapper: {
        position: 'absolute',
        height: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        zIndex: 2,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginTop: 8
    },
    adornment: {
        fontSize: 16,
        color: Colors.text,
    },
});