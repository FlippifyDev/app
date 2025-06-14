import { Colors } from '@/src/theme/colors';
import { Button, ButtonProps } from '@ui-kitten/components';
import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

interface FButtonProps extends ButtonProps {
    title: string;
    loading?: boolean;
}
const FButton: React.FC<FButtonProps> = ({ title, loading, style, ...rest }) => {
    return (
        <Button style={[styles.button, style]} {...rest}>
            {loading ? <ActivityIndicator size="small" color="white" /> : title}
        </Button>
    )
}


const styles = StyleSheet.create({
    button: {
        marginTop: 16,
        borderRadius: 12,
        paddingVertical: 15,
        backgroundColor: Colors.houseBlue
    }
});

export default FButton
