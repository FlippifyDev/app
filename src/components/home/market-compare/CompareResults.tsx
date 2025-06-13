import { IMarketItem, IMarketListedItem, IMarketSoldItem } from '@/src/models/market-compare';
import { Colors } from '@/src/theme/colors';
import { mapAccountToAccountName } from '@/src/utils/contants';
import { Ionicons } from '@expo/vector-icons';
import { Layout, Text } from '@ui-kitten/components';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import NoResultsFound from '../../ui/NoResultsFound';
import PageTitle from '../../ui/PageTitle';
import CardGrid from './GridCard';

interface Props {
    loading: boolean;
    marketItem?: IMarketItem;
    cacheKey: string;

}
const CompareResults = ({
    loading,
    marketItem,
    cacheKey
}: Props) => {
    const router = useRouter()
    const [hasValidlisted, setHasValidListed] = useState(false);
    const [hasValidSold, setHasValidSold] = useState(false);

    const [currentListed, setCurrentListed] = useState<IMarketListedItem>(marketItem?.ebay?.listed ?? {});
    const [currentSold, setCurrentSold] = useState<IMarketSoldItem>(marketItem?.ebay?.sold ?? {});
    const [selectedPlatform, setSelectedPlatform] = useState<string>("ebay");

    useFocusEffect(
        useCallback(() => {
            if (selectedPlatform === "ebay") {
                setCurrentListed(marketItem?.ebay?.listed ?? {});
                setCurrentSold(marketItem?.ebay?.sold ?? {});

                setHasValidListed(!(!marketItem?.ebay?.listed));
                setHasValidSold(!(!marketItem?.ebay?.sold));
            } else {
                setHasValidListed(false);
                setHasValidSold(false);
            }
        }, [selectedPlatform, marketItem])
    );

    const allPlatforms = Object.keys(marketItem ?? {}).filter(key => key !== "listing");

    async function handleAddListing() {
        router.push({
            pathname: `/home/add-listing`,
            params: {
                marketItem: JSON.stringify(marketItem),
                cacheKey: JSON.stringify(cacheKey)
            },
        });
    }


    return (
        <Layout style={{ flex: 1, backgroundColor: Colors.background }}>
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="small" />
                </View>
            ) : (
                <>
                    {(!hasValidlisted && !hasValidSold) ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <NoResultsFound />
                        </View>
                    ) : (
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80, backgroundColor: Colors.background }}>
                            {hasValidlisted && (
                                <View style={{ backgroundColor: Colors.background }}>
                                    <PageTitle text="Currently Listed" />

                                    {["ebay"].includes(selectedPlatform) && (
                                        <CardGrid item={currentListed} />
                                    )}
                                </View>
                            )}
                            {hasValidSold && (
                                <View style={{ backgroundColor: Colors.background }}>
                                    <PageTitle text="Currently Sold" />
                                    {["ebay"].includes(selectedPlatform) && (
                                        <CardGrid item={currentSold} />
                                    )}
                                </View>
                            )}
                        </ScrollView>
                    )}

                    {/* Bottom Tab Bar */}
                    <View style={styles.tabBar}>
                        <View style={styles.tabButtonsWrapper}>
                            {allPlatforms.map((platform) => (
                                <TouchableOpacity
                                    key={platform}
                                    style={[
                                        styles.tabButton,
                                        selectedPlatform === platform && styles.tabButtonSelected,
                                    ]}
                                    onPress={() => setSelectedPlatform(platform)}
                                >
                                    <Text
                                        style={[
                                            styles.tabButtonText,
                                            selectedPlatform === platform && styles.tabButtonTextSelected,
                                        ]}
                                    >
                                        {mapAccountToAccountName[platform]}
                                    </Text>
                                </TouchableOpacity>
                            ))}

                            <TouchableOpacity
                                style={[
                                    styles.tabButton,
                                    selectedPlatform === 'stockx' && styles.tabButtonSelected,
                                ]}
                                onPress={() => setSelectedPlatform('stockx')}
                            >
                                <Text
                                    style={[
                                        styles.tabButtonText,
                                        selectedPlatform === 'stockx' && styles.tabButtonTextSelected,
                                    ]}
                                >
                                    StockX
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.addButton} onPress={handleAddListing}>
                            <Ionicons name="add-outline" size={26} color="white" />
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </Layout>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        elevation: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    tabButtonsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        flex: 1,
    },
    tabButton: {
        backgroundColor: '#f3f3f3',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 20,
        marginRight: 8,
    },
    tabButtonSelected: {
        backgroundColor: Colors.houseBlue,
    },
    tabButtonText: {
        fontSize: 14,
        color: '#333',
    },
    tabButtonTextSelected: {
        fontWeight: 'bold',
        color: '#fff',
    },
    addButton: {
        position: 'absolute',
        right: 10,
        bottom: 20,
        backgroundColor: Colors.houseBlue,
        width: 52,
        height: 52,
        borderRadius: 26,
        justifyContent: 'center',
        alignItems: 'center',

        // iOS shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 5,

        // Android shadow
        elevation: 6,
    },
});

export default CompareResults;
