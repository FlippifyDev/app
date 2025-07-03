import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { ScrollView } from 'react-native-gesture-handler';

interface FItemModalProps {
    visible: boolean;
    title?: string;
    onClose: () => void;
    children: React.ReactNode;
}

const FItemModal: React.FC<FItemModalProps> = ({ visible, title, onClose, children }) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            {/* Backdrop */}
            <View style={styles.backdrop} />
            {/* Blur overlay */}
            <BlurView intensity={100} tint="light" style={styles.blurOverlay} />

            <View style={styles.modalContainer}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color="#fff" />
                    </TouchableOpacity>
                    {title && (
                        <Text style={styles.title}>{title}</Text>
                    )}
                </View>

                {/* Modal Content */}
                <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} >
                    {children}
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    blurOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    modalContainer: {
        paddingTop: 40,
        backgroundColor: '#00000080',
        borderRadius: 12,
        overflow: 'hidden',
        height: "100%"
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    closeButton: {
        marginRight: 12,
    },
    title: {
        flex: 1,
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left',
        marginHorizontal: 10
    },
    content: {
        padding: 16,
    },
    contentContainer: {
        paddingBottom: 32
    }
});

export default FItemModal;