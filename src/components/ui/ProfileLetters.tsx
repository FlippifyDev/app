import { Colors } from '@/src/theme/colors';
import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ProfileLettersProps {
    text: string;
    containerStyle?: ViewStyle | ViewStyle[];
    textStyle?: TextStyle | TextStyle[];
}

const ProfileLetters: React.FC<ProfileLettersProps> = ({ text, containerStyle, textStyle }) => {
    return (
        <View style={[styles.container, containerStyle]}>
            <Text style={[styles.text, textStyle]}>
                {text.toUpperCase()}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 999,   
        width: 40,
        height: 40,
        alignItems: 'center',     
        justifyContent: 'center',   
        backgroundColor: Colors.cardBackground,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#000000',    
    },
});

export default ProfileLetters;
