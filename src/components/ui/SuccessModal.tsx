import React, { useEffect, useRef } from 'react';
import { Animated, Linking, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/src/theme/colors';

interface SuccessModalProps {
    visible: boolean;
    onClose: () => void;
    message: string;
    linkText?: string;
    linkUrl?: string;
    isSuccess?: boolean;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
    visible,
    onClose,
    message,
    linkText,
    linkUrl,
    isSuccess = true,
}) => {
    const slideAnim = useRef(new Animated.Value(500)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            slideAnim.setValue(500);
        }
    }, [visible, slideAnim]);

    const openLink = () => {
        if (linkUrl) Linking.openURL(linkUrl);
    };

    const statusIcon = isSuccess ? 'checkmark-circle' : 'close-circle';
    const iconColor = isSuccess ? 'green' : 'red';

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={24} color="#fff" />
                    </TouchableOpacity>

                    <Ionicons name={statusIcon} size={48} color={iconColor} style={styles.statusIcon} />

                    <Text style={styles.message}>{message}</Text>

                    {linkText && linkUrl && (
                        <TouchableOpacity onPress={openLink}>
                            <Text style={styles.link}>{linkText}</Text>
                        </TouchableOpacity>
                    )}
                </Animated.View>
            </View>
        </Modal>
    );
};

export default SuccessModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: Colors.background,
        borderRadius: 12,
        padding: 24,
        width: '100%',
        maxWidth: 340,
        position: 'relative',
        alignItems: 'center',
    },
    statusIcon: {
        marginBottom: 12,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
    },
    link: {
        color: '#007aff',
        fontSize: 16,
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    closeButton: {
        position: 'absolute',
        top: -16,
        right: -16,
        backgroundColor: '#3c424b',
        borderRadius: 9999,
        padding: 8,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
});
