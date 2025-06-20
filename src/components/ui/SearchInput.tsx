import { Ionicons } from "@expo/vector-icons";
import { Input, InputProps } from "@ui-kitten/components";
import React, { useState } from "react";
import { ImageProps, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";

interface Props extends InputProps {
    containerStyle?: ViewStyle;
}
const SearchInput: React.FC<Props> = ({ containerStyle, style, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);

    // Render function for accessoryRight
    const renderAccessoryRight = (accessoryProps?: Partial<ImageProps>): React.ReactElement => {
        if (isFocused) {
            return (
                <TouchableOpacity
                    onPress={() => {
                        if (props.onChangeText) {
                            props.onChangeText(''); 
                        }
                    }}
                >
                    <Ionicons
                        name="close-outline"
                        size={24} 
                    />
                </TouchableOpacity>
            );
        }
        return <View />; 
    };

    return (
        <View style={[styles.container, containerStyle]}>
            <Input
                style={[styles.input, style]}
                accessoryRight={renderAccessoryRight} 
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...props}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    input: {
        borderRadius: 9999,
    },
});

export default SearchInput;