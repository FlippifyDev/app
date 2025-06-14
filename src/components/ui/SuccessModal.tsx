import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FModal from './FModal';

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

    const openLink = () => {
        if (linkUrl) Linking.openURL(linkUrl);
    };

    const statusIcon = isSuccess ? 'checkmark-circle' : 'close-circle';
    const iconColor = isSuccess ? 'green' : 'red';

    return (
        <FModal visible={visible} onClose={onClose}>
            <View style={styles.container}>
                <Ionicons name={statusIcon} size={48} color={iconColor} style={styles.statusIcon} />

                <Text style={styles.message}>{message}</Text>

                {linkText && linkUrl && (
                    <TouchableOpacity onPress={openLink}>
                        <Text style={styles.link}>{linkText}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </FModal>
    );
};

export default SuccessModal;

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        flexDirection: "column",
        alignItems: "center"
    },
    statusIcon: {
        marginBottom: 12,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
        fontWeight: "bold"
    },
    link: {
        color: '#007aff',
        fontSize: 16,
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
});
