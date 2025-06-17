import { Colors } from '@/src/theme/colors';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Keyboard, Modal, ModalProps, PanResponder, StyleSheet, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';

interface FModalProps extends ModalProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    containerStyle?: ViewStyle;
}

const FModal: React.FC<FModalProps> = ({
    visible,
    onClose,
    children,
    containerStyle,
    ...rest
}) => {
    // Animation values
    const slideAnim = useRef(new Animated.Value(0)).current; // Initial position off-screen will be set dynamically
    const keyboardAnim = useRef(new Animated.Value(0)).current;
    const backdropAnim = useRef(new Animated.Value(0)).current; // Backdrop opacity
    const modalHeight = useRef(0); // To store the modal's height

    // PanResponder for dragging
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_evt, { dy }) => {
                if (dy > 0) { // Only allow downward drag
                    slideAnim.setValue(dy);
                    // Update backdrop opacity: 1 (opaque) at dy=0, 0 (transparent) at dy=300
                    const opacity = 1 - (dy / 300);
                    backdropAnim.setValue(Math.max(opacity, 0));
                }
            },
            onPanResponderRelease: (_evt, { dy, vy }) => {
                if (dy > 100 || vy > 0.5) { // Close if dragged far or fast enough
                    Keyboard.dismiss();
                    Animated.parallel([
                        Animated.timing(slideAnim, {
                            toValue: modalHeight.current, // Slide to full height
                            duration: 200,
                            useNativeDriver: true,
                        }),
                        Animated.timing(backdropAnim, {
                            toValue: 0, // Fully transparent
                            duration: 200,
                            useNativeDriver: true,
                        }),
                    ]).start(() => onClose());
                } else { // Snap back to open position
                    Animated.parallel([
                        Animated.spring(slideAnim, {
                            toValue: 0,
                            useNativeDriver: true,
                        }),
                        Animated.spring(backdropAnim, {
                            toValue: 1,
                            useNativeDriver: true,
                        }),
                    ]).start();
                }
            },
        })
    ).current;

    // Handle modal visibility
    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0, // Slide up to visible position
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropAnim, {
                    toValue: 1, // Backdrop fully opaque
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            slideAnim.setValue(0); // Reset for next open
            backdropAnim.setValue(0);
            Keyboard.dismiss();
        }
    }, [visible, slideAnim, backdropAnim]);

    // Handle keyboard
    useEffect(() => {
        const keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', (e) => {
            const { duration, endCoordinates } = e;
            const keyboardHeight = endCoordinates.height;
            Animated.timing(keyboardAnim, {
                toValue: -keyboardHeight,
                duration: duration,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }).start();
        });

        const keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', (e) => {
            const { duration } = e;
            Animated.timing(keyboardAnim, {
                toValue: 0,
                duration: duration,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }).start();
        });

        return () => {
            keyboardWillShowListener.remove();
            keyboardWillHideListener.remove();
        };
    }, [keyboardAnim]);

    const handleOverlayPress = () => {
        if (Keyboard.isVisible()) {
            Keyboard.dismiss();
        } else {
            onClose();
        }
    };

    return (
        <Modal visible={visible} transparent animationType="none" {...rest}>
            <View style={[styles.container, containerStyle]}>
                {/* Backdrop with animated opacity */}
                <TouchableWithoutFeedback onPress={handleOverlayPress}>
                    <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]} />
                </TouchableWithoutFeedback>

                {/* Modal content */}
                <Animated.View
                    style={[
                        styles.modalContent,
                        {
                            transform: [
                                { translateY: Animated.add(keyboardAnim, slideAnim) },
                            ],
                        },
                    ]}
                    onLayout={(event) => {
                        modalHeight.current = event.nativeEvent.layout.height;
                    }}
                >
                    <View style={styles.modalHeader} {...panResponder.panHandlers}>
                        <View style={styles.dragHandle} />
                    </View>
                    <View style={styles.contentContainer}>{children}</View>
                </Animated.View>
            </View>
        </Modal>
    );
};

export default FModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContent: {
        backgroundColor: Colors.background,
        borderRadius: 28,
        paddingTop: 10,
        paddingHorizontal: 24,
        width: '100%',
        position: 'relative',
        alignItems: 'center',
        maxHeight: '90%',
    },
    modalHeader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        height: 20,
        marginBottom: 10,
    },
    dragHandle: {
        width: 45,
        height: 4,
        backgroundColor: Colors.cardSelectedBackground,
        borderRadius: 2.5,
    },
    contentContainer: {
        width: '100%',
        paddingBottom: 24,
    },
});