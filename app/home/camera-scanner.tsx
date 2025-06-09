
import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { BarcodeScanningResult, CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CameraScannerScreen() {
    const router = useRouter();
    const [scanned, setScanned] = useState(false);
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [checkingPermission, setCheckingPermission] = useState(true);

    useFocusEffect(
        useCallback(() => {
            async function requestCamPermission() {
                setCheckingPermission(true);
                const result = await requestPermission();
                setCheckingPermission(false);

                if (!result.granted) {
                    router.back();
                }
            }

            requestCamPermission();
        }, [requestPermission, router])
    );

    if (checkingPermission) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="white" />
                <Text style={styles.message}>Requesting camera permission...</Text>
            </View>
        );
    }


    if (!permission?.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>
                    Camera permission was denied. Please enable it from settings to use the scanner.
                </Text>
            </View>
        );
    }


    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    function handleBarcodeScanned({ type, data }: BarcodeScanningResult) {
        if (!scanned) {
            setScanned(true);
            alert(`Scanned ${type}: ${data}`);
        }
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing={facing}
                barcodeScannerSettings={{
                    barcodeTypes: ['qr', 'ean13', 'code128', 'pdf417'],
                }}
                onBarcodeScanned={handleBarcodeScanned}
            >
                {/* Bottom tab for controls */}
                <View style={styles.bottomTab}>
                    <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
                        <Ionicons name="camera-reverse-outline" size={28} color="white" />
                    </TouchableOpacity>
                </View>
                <View style={styles.overlay}>
                    <View style={styles.topOverlay} />

                    <View style={styles.middleRow}>
                        <View style={styles.sideOverlay} />
                        <View style={styles.cutout} />
                        <View style={styles.sideOverlay} />
                    </View>

                    <View style={styles.bottomOverlay} />
                </View>

            </CameraView >


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    startButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: 'royalblue',
        borderRadius: 8,
    },
    startText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    message: {
        color: Colors.text,
        fontSize: 16,
        textAlign: 'center',
        paddingBottom: 10,
    },
    bottomTab: {
        zIndex: 20,
        height: "100%",
        paddingHorizontal: 24,
        paddingVertical: 16,
        justifyContent: "flex-end",
        alignItems: 'flex-end',
    },
    controlButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    controlText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 6,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },

    topOverlay: {
        flex: 1,
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },

    middleRow: {
        flexDirection: 'row',
        height: 250, // Height of square
    },

    sideOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },

    cutout: {
        width: 250,
        height: 250,
        borderWidth: 1,
        borderColor: 'white',
        backgroundColor: 'transparent',
    },

    bottomOverlay: {
        flex: 1,
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
});