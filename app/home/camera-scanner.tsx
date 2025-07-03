import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { BarcodeScanningResult, CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Defs, Mask, Rect } from "react-native-svg";


const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// Rectangle dimensions
const RECT_WIDTH = SCREEN_W * 0.8;
const RECT_HEIGHT = 200;

// Compute its on-screen bounds
const RECT_LEFT = (SCREEN_W - RECT_WIDTH) / 2;
const RECT_TOP = (SCREEN_H - RECT_HEIGHT) / 3;
const RECT_RIGHT = RECT_LEFT + RECT_WIDTH;
const RECT_BOTTOM = RECT_TOP + RECT_HEIGHT;

export default function CameraScannerScreen() {
    const router = useRouter();
    const [scanned, setScanned] = useState(false);
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [checkingPermission, setCheckingPermission] = useState(true);

    useEffect(() => {
        setScanned(false)
    }, [])

    useFocusEffect(
        useCallback(() => {
            setScanned(false);
        }, [])
    );

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
                <ActivityIndicator size="small" />
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

    async function handleBarcodeScanned(event: BarcodeScanningResult) {
        const { bounds, data } = event;

        if (bounds) {
            const centerX = bounds.origin.x + bounds.size.width / 2;
            const centerY = bounds.origin.y + bounds.size.height / 2;

            // If barcode outside the rectangle, ignore it:
            if (
                centerX < RECT_LEFT ||
                centerX > RECT_RIGHT ||
                centerY < RECT_TOP ||
                centerY > RECT_BOTTOM
            ) {
                return;
            }
        }

        if (!scanned) {
            setScanned(true);
            router.push({ pathname: `/home/recents/compare`, params: { query: String(data.trim()) } });
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

                <OverlayWithRoundedHole />
            </CameraView >
        </View>
    );
}

const OverlayWithRoundedHole = () => (
    <Svg
        width={SCREEN_W}
        height={SCREEN_H}
        style={StyleSheet.absoluteFill}
    >
        <Defs>
            <Mask id="cutout-mask">
                {/* Full‐screen opaque base */}
                <Rect x="0" y="0" width={SCREEN_W} height={SCREEN_H} fill="white" />
                {/* Transparent hole: the white here “cuts out” */}
                <Rect
                    x={RECT_LEFT}
                    y={RECT_TOP}
                    width={RECT_WIDTH}
                    height={RECT_HEIGHT}
                    rx={16}      // same as your borderRadius
                    ry={16}
                    fill="black"
                />
            </Mask>
        </Defs>

        {/* Semitransparent fill, but masked by our “cutout-mask” */}
        <Rect
            x="0"
            y="0"
            width={SCREEN_W}
            height={SCREEN_H}
            fill="rgba(0,0,0,0.6)"
            mask="url(#cutout-mask)"
        />
        {/* You can still render your white border on top */}
        <Rect
            x={RECT_LEFT}
            y={RECT_TOP}
            width={RECT_WIDTH}
            height={RECT_HEIGHT}
            rx={16}
            ry={16}
            fill="none"
            stroke="white"
            strokeWidth={2}
        />
    </Svg>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
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
    camera: {
        flex: 1,
    },
});