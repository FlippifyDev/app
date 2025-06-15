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
    style,
    ...rest
}) => {
    const slideAnim = useRef(new Animated.Value(500)).current;
    const keyboardAnim = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_evt, { dy }) => {
                const adjustedDy = dy < 0 ? dy * 0.3 : dy;
                slideAnim.setValue(adjustedDy);
            },
            onPanResponderRelease: (_evt, { dy, vy }) => {
                if (dy > 100 || vy > 0.5) {
                    Keyboard.dismiss();
                    Animated.timing(slideAnim, {
                        toValue: 300,
                        duration: 200,
                        useNativeDriver: true,
                    }).start(onClose);
                } else {
                    Animated.spring(slideAnim, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            slideAnim.setValue(500);
            Keyboard.dismiss();
        }
    }, [visible, slideAnim]);

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
        <Modal visible={visible} transparent animationType="fade" {...rest}>
            <View style={[styles.container, containerStyle]}>
                {/* Backdrop: only this area closes on tap */}
                <TouchableWithoutFeedback onPress={handleOverlayPress}>
                    <View style={styles.backdrop} />
                </TouchableWithoutFeedback>

                <Animated.View
                    style={[
                        styles.modalContent,
                        {
                            transform: [
                                { translateY: Animated.add(keyboardAnim, slideAnim) },
                            ],
                        },
                    ]}
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
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.background,
        borderRadius: 28,
        paddingTop: 10,
        paddingHorizontal: 24,
        width: '100%',
        position: 'relative',
        alignItems: 'center',
        maxHeight: "90%"
    },
    modalHeader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center",
        position: 'relative',
        height: 20,
        marginBottom: 10
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