import { useUser } from '@/src/hooks/useUser';
import { IListing } from '@/src/models/store-data';
import { createItem } from '@/src/services/api/create-item';
import { retrieveIdToken } from '@/src/services/firebase/retrieve';
import { Colors } from '@/src/theme/colors';
import { addCacheData, retrieveCacheItem, setCacheItem } from '@/src/utils/cache-helpers';
import { inventoryCacheKey, subColsCacheKey } from '@/src/utils/contants';
import { formatDateToISO } from '@/src/utils/format';
import { generateRandomFlippifyListingId } from '@/src/utils/generate-random';
import { validatePriceInput } from '@/src/utils/input-validation';
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
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import DatePicker from '../../ui/DatePicker';
import FButton from '../../ui/FButton';
import ImageUpload from '../../ui/ImageUpload';
import Input from '../../ui/Input';
import SuccessModal from '../../ui/SuccessModal';
import { inventoryCol } from '@/src/services/firebase/constants';
import { updateItem } from '@/src/services/firebase/update';



const Editor = () => {
    const user = useUser();
    const cacheKey = `${inventoryCacheKey}-${user?.id}`
    const [listing, setListing] = useState<IListing>({});
    const currencySymbol = CurrencyList.get(user?.preferences?.currency ?? 'USD')?.symbol_native;
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [failed, setFailed] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [listingPrice, setListingPrice] = useState<string | null>(null);
    const [purchasePrice, setPurchasePrice] = useState<string | null>(null);

    // Image Upload
    const [fileName, setFileName] = useState("Upload Image");
    const [url, setUrl] = useState("");
    const [showImageUploadModal, setShowImageUploadModal] = useState(false);

    const updateField = <K extends keyof IListing>(field: K, value: IListing[K]) => {
        const updated = { ...listing, [field]: value };
        setListing(updated);
    };

    async function handleAddItem() {
        setMessage("");
        setShowSuccessModal(false);
        setLoading(true);
        setFailed(false);

        const idToken = await retrieveIdToken();
        if (!idToken) {
            setMessage("Could not authenticate user");
            setLoading(false);
            setShowSuccessModal(true);
            setFailed(true)
            return;
        }

        if (!listing.storeType || !listing.name) {
            setMessage("Please fill out all the required fields");
            setLoading(false);
            setShowSuccessModal(true);
            setFailed(true)
            return;
        }

        if (!listing.dateListed) {
            listing.dateListed = formatDateToISO(new Date());
        }

        if (!listing.purchase) {
            listing.purchase = {};
            listing.purchase.date = formatDateToISO(new Date());
        }

        const item: IListing = {
            ...listing,
            storeType: listing.storeType?.toLowerCase(),
            createdAt: formatDateToISO(new Date()),
            condition: "Brand New",
            initialQuantity: listing.quantity,
            itemId: listing.itemId ? listing.itemId : generateRandomFlippifyListingId(),
            lastModified: formatDateToISO(new Date()),
            recordType: "manual",
            image: url ? [url] : listing.image,
        }

        let error;
        let message;
        if (listing.itemId && item.storeType && item.dateListed) {
            await updateItem({ uid: user?.id as string, item, rootCol: inventoryCol, subCol: item.storeType });
            message = "Listing edited successfully!"
        } else {
            const { error: createError } = await createItem({ idToken, item });
            message = "Listing added successfully!"
            error = createError;
        }
        if (error) {
            setMessage(error);
            setFailed(true);
        } else {
            const storeCache = await retrieveCacheItem(`${subColsCacheKey}-${user?.id}`) as string[];
            if (!storeCache) {
                await setCacheItem(`${subColsCacheKey}-${user?.id}`, [item.storeType])
            } else if (!storeCache.includes(item.storeType as string)) {
                await setCacheItem(`${subColsCacheKey}-${user?.id}`, [...storeCache, item.storeType])
            }
            await addCacheData(cacheKey, { [item.itemId as string]: item });
            setShowSuccessModal(true);
            setMessage(message);
        }

        setLoading(false);
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <ScrollView
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Image */}
                    <TouchableOpacity
                        onPress={() => setShowImageUploadModal(true)}
                    >
                        {url && (
                            <Image source={{ uri: url }} style={styles.image} />
                        )}
                        {(!url && listing.image?.[0]) && (
                            <Image source={{ uri: listing.image[0] }} style={styles.image} />
                        )}
                        {(!url && !listing.image?.[0]) && (

                            <View style={[styles.image, styles.placeholder]}>
                                <Text style={styles.placeholderText}>No Image</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* Inputs */}
                    <Input
                        label="Name*"
                        value={listing.name ?? ''}
                        onChangeText={(text) => updateField('name', text)}
                        placeholder="Item name"
                    />

                    <Input
                        label="Listing Platform*"
                        value={listing.storeType ?? ''}
                        onChangeText={(text) => updateField('storeType', text.toLowerCase())}
                        placeholder="Listing Platform*"
                        autoCapitalize="none"
                        autoCorrect={false}
                        readOnly={!(!listing.itemId)}
                        style={!(!listing.itemId) ? { backgroundColor: Colors.muted } : undefined}
                    />

                    <Input
                        label="Listing Price*"
                        value={listingPrice?.toString()}
                        onChangeText={(text) => validatePriceInput(text, setListingPrice)}
                        onBlur={() => updateField('price', listingPrice ? parseFloat(listingPrice) : null)}
                        placeholder="Listing Price*"
                        keyboardType="decimal-pad"
                        adornment={currencySymbol}
                        adornmentPosition="left"
                    />
                    <Input
                        label="Purchase Price"
                        value={purchasePrice?.toString() ?? ''}
                        onChangeText={(text) => validatePriceInput(text, setPurchasePrice)}
                        onBlur={() =>
                            setListing(prev => ({
                                ...prev,
                                purchase: {
                                    ...prev.purchase,
                                    price: purchasePrice ? parseFloat(purchasePrice) : null,
                                },
                            }))
                        }
                        placeholder="Purchase Price"
                        keyboardType="numeric"
                        adornment={currencySymbol}
                        adornmentPosition="left"
                    />
                    <Input
                        label="Quantity"
                        value={listing.quantity?.toString() ?? ''}
                        onChangeText={(text) => updateField('quantity', parseInt(text) || 0)}
                        keyboardType="numeric"
                        placeholder="Quantity"
                    />

                    <DatePicker
                        label="Listing Date"
                        value={new Date(listing.dateListed ?? new Date()) ?? new Date()}
                        onChange={(date) => updateField('dateListed', date.toISOString())}
                    />

                    <DatePicker
                        label="Purchase Date"
                        value={new Date(listing.purchase?.date ?? new Date()) ?? new Date()}
                        onChange={(date) =>
                            setListing(prev => ({
                                ...prev,
                                purchase: {
                                    ...prev.purchase,
                                    date: formatDateToISO(date),
                                },
                            }))
                        }
                    />

                    <Input
                        label="SKU"
                        value={listing.sku ?? ''}
                        onChangeText={(text) => updateField('sku', text.trim())}
                        placeholder="SKU"
                    />

                    <Input
                        label="Storage Location"
                        value={listing.storageLocation ?? ''}
                        onChangeText={(text) => updateField('storageLocation', text)}
                        placeholder="Storage Location"
                    />

                    <FButton
                        title={listing.itemId ? 'Edit' : 'Add'}
                        onPress={handleAddItem}
                        disabled={loading}
                        loading={loading}
                    />

                    <SuccessModal
                        visible={showSuccessModal}
                        message={message}
                        linkText="View Item"
                        onClose={() => setShowSuccessModal(false)}
                        isSuccess={!failed}
                    />

                    {showImageUploadModal && (
                        <ImageUpload
                            visible={showImageUploadModal}
                            fileName={fileName}
                            setIsModalOpen={setShowImageUploadModal}
                            setFileName={setFileName}
                            setUrl={setUrl}
                        />
                    )}
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default Editor;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flexDirection: "column",
        gap: 16,
    },
    image: {
        width: '100%',
        height: 250,
        borderRadius: 12,
        backgroundColor: '#eee',
        resizeMode: 'cover',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
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