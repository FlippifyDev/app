// Local Imports
import Recents from '@/src/components/home/Recents';
import PageTitle from '@/src/components/ui/PageTitle';
import SearchInput from '@/src/components/ui/SearchInput';
import { Colors } from '@/src/theme/colors';

// External Imports
import { Layout } from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';


export default function HomeScreen() {
    const router = useRouter();
    const [query, setQuery] = useState("");

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: Colors.background }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <Layout style={styles.container}>
                    <View style={styles.content}>
                        <PageTitle text="Recents" />
                        <View style={styles.recent}>
                            <Recents />
                        </View>
                    </View>

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
                                router.push({ pathname: `/home/compare-result`, params: { query: String(query.trim()) } });
                                setQuery('');
                            }
                        }}
                    />
                </Layout>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingHorizontal: 16,
        paddingTop: 32,
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
    input: {
        backgroundColor: Colors.cardBackground,
        borderWidth: 0,
        marginBottom: 10,
        marginHorizontal: 15
    },
    inputText: {
        fontSize: 20,
        color: Colors.text,
    }
})