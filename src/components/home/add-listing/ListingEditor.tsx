import { IListing } from '@/src/models/store-data';
import CurrencyList from 'currency-list';
import React, { useState } from 'react';
import {
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import Input from '../../ui/Input';

interface Props {
    listing: IListing;
}

const ListingEditor: React.FC<Props> = ({ listing }) => {
    const [localListing, setLocalListing] = useState<IListing>({ ...listing });
    const currencySymbol = CurrencyList.get(listing.currency ?? 'USD')?.symbol_native;

    const updateField = <K extends keyof IListing>(field: K, value: IListing[K]) => {
        const updated = { ...localListing, [field]: value };
        setLocalListing(updated);
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Image */}
                    {localListing.image?.[0] ? (
                        <Image source={{ uri: localListing.image[0] }} style={styles.image} />
                    ) : (
                        <View style={[styles.image, styles.placeholder]}>
                            <Text style={styles.placeholderText}>No Image</Text>
                        </View>
                    )}
                    {/* Inputs */}
                    <Input
                        label="Name"
                        value={localListing.name ?? ''}
                        onChangeText={(text) => updateField('name', text)}
                        placeholder="Item name"
                    />

                    <Input
                        label="Price"
                        value={localListing.price?.toString() ?? ''}
                        onChangeText={(text) => updateField('price', parseFloat(text) || 0)}
                        placeholder="0.00"
                        keyboardType="numeric"
                        adornment={currencySymbol}
                        adornmentPosition="left"
                    />

                    <Input
                        label="SKU"
                        value={localListing.sku ?? ''}
                        onChangeText={(text) => updateField('sku', text)}
                        placeholder="SKU"
                    />

                    <Input
                        label="Currency"
                        value={localListing.currency ?? ''}
                        onChangeText={(text) => updateField('currency', text)}
                        placeholder="USD"
                    />

                    <Input
                        label="Quantity"
                        value={localListing.quantity?.toString() ?? ''}
                        onChangeText={(text) => updateField('quantity', parseInt(text) || 0)}
                        keyboardType="numeric"
                        placeholder="1"
                    />

                    <Input
                        label="Custom Tag"
                        value={localListing.customTag ?? ''}
                        onChangeText={(text) => updateField('customTag', text)}
                        placeholder="Tag"
                    />

                    <Input
                        label="Storage Location"
                        value={localListing.storageLocation ?? ''}
                        onChangeText={(text) => updateField('storageLocation', text)}
                        placeholder="Shelf A"
                    />
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default ListingEditor;

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        backgroundColor: '#eee',
        resizeMode: 'cover',
        marginBottom: 20,
    },
    placeholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#888',
        fontSize: 14,
    },
});