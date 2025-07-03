import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';

interface CardProps {
    style?: StyleProp<ViewStyle>;
    children: React.ReactNode;
    onPress?: (value: any) => void;
    href?: "connected-accounts" | "subscription" | "plans" | "socials"; 
    externalHref?: string;
}

const Card = ({ style, children, href, externalHref, onPress }: CardProps) => {
    const router = useRouter();

    const handlePress = async () => {
        if (href) {
            router.push(`/home/settings/${href}`); 
        }
        if (externalHref) {
            await WebBrowser.openBrowserAsync(externalHref);
        }
    };

    // Only make the card touchable if onPress or href is provided
    if (onPress || href || externalHref) {
        return (
            <TouchableOpacity style={[styles.container, style]} onPress={onPress || handlePress} activeOpacity={1}>
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