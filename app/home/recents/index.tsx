// Local Imports
import Recents from '@/src/components/home/Recents';
import PageTitle from '@/src/components/ui/PageTitle';
import SearchInput from '@/src/components/ui/SearchInput';
import { Colors } from '@/src/theme/colors';
import { Ionicons } from '@expo/vector-icons';

// External Imports
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';


export default function RecentsScreen() {
    const router = useRouter();
    const [query, setQuery] = useState("");


    function handleCameraIconPress() {
        router.push("/home/camera-scanner");
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: Colors.background }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={40}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.container}>
                    <View style={styles.content}>
                        <PageTitle text="Recents" />
                        <View style={styles.recent}>
                            <Recents />
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <View style={styles.inputContainer}>
                            <SearchInput
                                value={query}
                                placeholder="Enter keyword, sku, query"
                                style={styles.input}
                                size="large"
                                textStyle={styles.inputText}
                                autoCorrect={false}
                                autoComplete="off"
                                spellCheck={false}
                                onChangeText={(text) => setQuery(text)}
                                onSubmitEditing={() => {
                                    Keyboard.dismiss();

                                    if (query.trim()) {
                                        router.push({ pathname: `/home/recents/compare`, params: { query: String(query.trim()) } });
                                        setQuery('');
                                    }
                                }}
                            />
                        </View>
                        <TouchableOpacity style={styles.cameraIcon} onPress={handleCameraIconPress}>
                            <Ionicons name="camera-outline" size={28} color={Colors.text} />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingHorizontal: 1,
        paddingBottom: 0,
        justifyContent: 'space-between',
    },
    content: {
        flex: 1,
        justifyContent: 'flex-start',
        color: Colors.textSecondary,
    },
    recent: {
        flex: 1,
        marginVertical: 6,
        justifyContent: "center",
        alignItems: "center",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
        width: "100%",
        paddingHorizontal: 20
    },
    cameraIcon: {
        width: "10%",
        alignItems: "center",
        marginLeft: 10
    },
    inputContainer: {
        width: "90%",
    },
    input: {
        backgroundColor: Colors.cardBackground,
        borderWidth: 0,
    },
    inputText: {
        fontSize: 16,
        color: Colors.text,
    }
})