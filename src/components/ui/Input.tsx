import { Colors } from "@/src/theme/colors";
import { Text } from "@ui-kitten/components";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

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
    const isLeft = adornment && adornmentPosition === 'left';
    const isRight = adornment && adornmentPosition === 'right';

    return (
        <View style={{ flex: 1 }}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={styles.wrapper}>
                {isLeft && (
                    <View style={[styles.adornmentWrapper, styles.leftBorder]}>
                        <Text style={styles.adornment}>{adornment}</Text>
                    </View>
                )}
                <TextInput
                    style={[
                        styles.input,
                        isLeft && { paddingLeft: 40 },
                        isRight && { paddingRight: 40 },
                        style,
                    ]}
                    placeholderTextColor={Colors.textPlaceholder}
                    {...rest}
                />
                {isRight && (
                    <View style={[styles.adornmentWrapper, styles.rightBorder]}>
                        <Text style={styles.adornment}>{adornment}</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

export default Input;

const styles = StyleSheet.create({
    wrapper: {
        height: 48,
        position: 'relative',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textSecondary,
        marginTop: 12,
        marginBottom: 4,
    },
    input: {
        height: "100%",
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        backgroundColor: Colors.background,
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
    },
    leftBorder: {
        borderRightWidth: 1,
        borderColor: '#ccc'
    },
    rightBorder: {
        borderLeftWidth: 1,
        borderColor: '#ccc'
    },
    adornment: {
        fontSize: 16,
        color: Colors.text,
    },
});
