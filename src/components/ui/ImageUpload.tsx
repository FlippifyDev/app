import { uploadImage } from '@/src/services/imgur/upload';
import { Colors } from '@/src/theme/colors';
import { validateUrlInput } from '@/src/utils/input-validation';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface ImageUploadProps {
    fileName: string;
    visible: boolean;
    setFileName: (fileName: string) => void;
    setIsModalOpen: (isOpen: boolean) => void;
    setUrl: (value: string) => void;
    handleUpload?: (imageUrl?: string | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    fileName,
    visible,
    setFileName,
    setIsModalOpen,
    setUrl,
    handleUpload,
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

    const [error, setError] = useState('');
    const [validImage, setValidImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState<{ uri: string; fileName?: string } | null>(null);
    const [validUrl, setValidUrl] = useState(false);
    const [localUrl, setLocalUrl] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        })();
    }, []);

    const handleImageUpload = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            const fileName = uri.split('/').pop() || 'Image';
            setSelectedImage({ uri, fileName });
            setFileName(fileName);
            setValidImage(true);
        }
    };

    const handleUrlInput = (value: string) => {
        validateUrlInput(value, setLocalUrl, setValidUrl);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedImage(null);
        setFileName('Upload Image');
        setValidUrl(false);
        setValidImage(false);
    };

    const handleLocalUpload = async () => {
        setLoading(true);
        setUrl(localUrl);
        let imageUrl: string | null = localUrl;
        if (selectedImage) {
            try {
                const base64 = await FileSystem.readAsStringAsync(selectedImage.uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                imageUrl = await uploadImage(base64);
                if (!imageUrl) {
                    setError('Image failed to upload. Please try again.');
                    setLoading(false);
                    return;
                }
                setUrl(imageUrl);
            } catch (error) {
                console.error('Image upload failed:', error);
                setError('Image failed to upload. Please try again.');
                setLoading(false);
                return;
            }
        } else if (validUrl) {
            imageUrl = localUrl;
        } else {
            setError('No valid image or URL provided.');
            setLoading(false);
            return;
        }
        handleUpload?.(imageUrl);
        setLoading(false);
        setIsModalOpen(false);
        setSelectedImage(null);
        setFileName('Upload Image');
    };

    function shortenFileName(fileName: string) {
        if (fileName.length <= 14) return fileName;
        const firstThree = fileName.substring(0, 7);
        const lastThree = fileName.substring(fileName.length - 7);
        return `${firstThree}...${lastThree}`;
    }

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
                    <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color="white" />
                    </TouchableOpacity>

                    {error && <Text style={styles.error}>{error}</Text>}
                    {/**
                     * 
                     
                    <TouchableOpacity
                        onPress={validUrl ? undefined : handleImageUpload}
                        style={[styles.uploadButton, validUrl && styles.disabledButton]}
                    >
                        <Text style={styles.uploadButtonText}>
                            {fileName === 'Upload Image' ? fileName : shortenFileName(fileName)}
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.orSeparator}>
                        <View style={styles.hr} />
                        <Text style={styles.orText}>or</Text>
                        <View style={styles.hr} />
                    </View>
                    */}
                    <TextInput
                        style={styles.urlInput}
                        onChangeText={handleUrlInput}
                        placeholder="Paste URL"
                        value={localUrl}
                        editable={!validImage}
                        autoCapitalize='none'
                        autoCorrect={false}
                        spellCheck={false}
                        placeholderTextColor={Colors.textPlaceholder}
                    />
                    <TouchableOpacity
                        onPress={handleLocalUpload}
                        disabled={!validImage && !validUrl}
                        style={[styles.uploadPhotoButton, (!validImage && !validUrl) && styles.disabledButton]}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#000" />
                        ) : (
                            <Ionicons name="image-outline" size={20} color="black" />
                        )}
                        <Text style={styles.uploadPhotoText}>Upload</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 10,
        width: 300,
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
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
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#000000',
    },
    error: {
        color: '#ff0000',
        marginBottom: 10,
        fontSize: 14,
    },
    uploadButton: {
        backgroundColor: '#808080',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        width: '50%',
        alignItems: 'center',
    },
    uploadButtonText: {
        color: '#ffffff',
        fontSize: 14,
    },
    disabledButton: {
        opacity: 0.5,
    },
    orSeparator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        width: '50%',
    },
    hr: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.textSecondary,
    },
    orText: {
        marginHorizontal: 10,
        color: Colors.textSecondary,
        fontWeight: 'bold',
        fontSize: 14,
    },
    urlInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 5,
        height: 36,
        width: '100%',
        marginBottom: 10,
        marginTop: 10,
        backgroundColor: Colors.background,
        borderRadius: 5,
        textAlign: 'center',
        fontSize: 14,
    },
    uploadPhotoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    uploadPhotoText: {
        marginLeft: 5,
        fontSize: 14,
        color: '#000000',
    },
});

export default ImageUpload;