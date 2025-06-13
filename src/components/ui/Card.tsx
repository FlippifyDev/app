import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface CardProps {
    style?: StyleProp<ViewStyle>;
    children: React.ReactNode;
    href?: "connected-accounts" | "subscription"; 
}

const Card = ({ style, children, href }: CardProps) => {
    const router = useRouter();

    const handlePress = () => {
        if (href) {
            router.push(`/home/settings/${href}`); 
        }
    };

    // Only make the card touchable if onPress or href is provided
    if (href) {
        return (
            <TouchableOpacity style={[styles.container, style]} onPress={handlePress} activeOpacity={0.7}>
                {children}
            </TouchableOpacity>
        );
    }

    return <View style={[styles.container, style]}>{children}</View>;
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginVertical: 6,
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'visible',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
});

export default Card;