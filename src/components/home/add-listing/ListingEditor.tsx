import { useMarketStorage } from '@/src/hooks/useMarketStorage';
import { useUser } from '@/src/hooks/useUser';
import { IMarketItem } from '@/src/models/market-compare';
import { IListing } from '@/src/models/store-data';
import { createItem } from '@/src/services/api/create-item';
import { inventoryCol } from '@/src/services/firebase/constants';
import { retrieveIdToken } from '@/src/services/firebase/retrieve';
import { updateItem } from '@/src/services/firebase/update';
import { formatDateToISO } from '@/src/utils/format';
import { generateRandomFlippifyListingId } from '@/src/utils/generate-random';
import CurrencyList from 'currency-list';
import React, { useEffect, useState } from 'react';
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

interface Props {
    marketItem: IMarketItem;
    cacheKey: string;
}

const ListingEditor: React.FC<Props> = ({ marketItem, cacheKey }) => {
    const user = useUser();
    const listing = marketItem.listing as IListing;
    const [localListing, setLocalListing] = useState<IListing>({ ...listing });
    const currencySymbol = CurrencyList.get(listing.currency ?? 'USD')?.symbol_native;
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [failed, setFailed] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Image Upload
    const [fileName, setFileName] = useState("Upload Image");
    const [url, setUrl] = useState("");
    const [showImageUploadModal, setShowImageUploadModal] = useState(false);
    const { updateItem: updateCache } = useMarketStorage()

    useEffect(() => {
        setLocalListing({ ...listing });
    }, [listing]);



    const updateField = <K extends keyof IListing>(field: K, value: IListing[K]) => {
        const updated = { ...localListing, [field]: value };
        setLocalListing(updated);
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

        if (!localListing.storeType || !localListing.name) {
            setMessage("Please fill out all the required fields");
            setLoading(false);
            setShowSuccessModal(true);
            setFailed(true)
            return;
        }

        const item: IListing = {
            ...localListing,
            storeType: localListing.storeType?.toLowerCase(),
            createdAt: formatDateToISO(new Date()),
            condition: "Brand New",
            initialQuantity: localListing.quantity,
            itemId: listing.itemId ? listing.itemId : generateRandomFlippifyListingId(),
            lastModified: formatDateToISO(new Date()),
            recordType: "manual",
            image: url ? [url] : localListing.image
        }

        let error;
        let message;
        if (listing.itemId && item.storeType) {
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
            marketItem.listing = item;
            await updateCache(cacheKey, marketItem);
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
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                        {(!url && localListing.image?.[0]) && (
                            <Image source={{ uri: localListing.image[0] }} style={styles.image} />
                        )}
                        {(!url && !localListing.image?.[0]) && (

                            <View style={[styles.image, styles.placeholder]}>
                                <Text style={styles.placeholderText}>No Image</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* Inputs */}
                    <Input
                        label="Name*"
                        value={localListing.name ?? ''}
                        onChangeText={(text) => updateField('name', text.trim())}
                        placeholder="Item name"
                    />

                    <Input
                        label="Listing Platform*"
                        value={localListing.storeType ?? ''}
                        onChangeText={(text) => updateField('storeType', text.toLowerCase().trim())}
                        placeholder="Listing Platform*"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    <Input
                        label="Listing Price*"
                        value={localListing.price?.toString() ?? ''}
                        onChangeText={(text) => updateField('price', parseFloat(text) || 0)}
                        placeholder="0.00"
                        keyboardType="numeric"
                        adornment={currencySymbol}
                        adornmentPosition="left"
                    />
                    <Input
                        label="Purchase Price"
                        value={localListing.purchase?.price?.toString() ?? ''}
                        onChangeText={(text) =>
                            setLocalListing(prev => ({
                                ...prev,
                                purchase: {
                                    ...prev.purchase,
                                    price: parseFloat(text) || 0,
                                },
                            }))
                        }
                        placeholder="0.00"
                        keyboardType="numeric"
                        adornment={currencySymbol}
                        adornmentPosition="left"
                    />
                    <Input
                        label="Quantity"
                        value={localListing.quantity?.toString() ?? ''}
                        onChangeText={(text) => updateField('quantity', parseInt(text) || 0)}
                        keyboardType="numeric"
                        placeholder="1"
                    />

                    <DatePicker
                        label="Listing Date"
                        value={new Date(localListing.dateListed ?? new Date()) ?? new Date()}
                        onChange={(date) => updateField('dateListed', date.toISOString())}
                    />

                    <DatePicker
                        label="Purchase Date"
                        value={new Date(localListing.purchase?.date ?? new Date()) ?? new Date()}
                        onChange={(date) =>
                            setLocalListing(prev => ({
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
                        value={localListing.sku ?? ''}
                        onChangeText={(text) => updateField('sku', text.trim())}
                        placeholder="SKU"
                    />

                    <Input
                        label="Storage Location"
                        value={localListing.storageLocation ?? ''}
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

export default ListingEditor;

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