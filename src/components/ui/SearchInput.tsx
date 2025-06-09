import { Input, InputProps } from "@ui-kitten/components";
import { StyleSheet, View, ViewStyle } from "react-native";


interface Props extends InputProps {
    containerStyle?: ViewStyle;
}

const SearchInput: React.FC<Props> = ({ containerStyle, style, ...props }) => {
    return (
        <View style={[styles.container, containerStyle]}>
            <Input
                style={[styles.input, style]}
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
        borderRadius: 12,
    },
});

export default SearchInput;