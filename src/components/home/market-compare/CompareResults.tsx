import { IMarketListedItem, IMarketSoldItem } from '@/src/models/market-compare';
import { Colors } from '@/src/theme/colors';
import { mapAccountToAccountName } from '@/src/utils/contants';
import { Layout, Text } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import NoResultsFound from '../../ui/NoResultsFound';
import CardGrid from './GridCard';

interface Props {
    loading: boolean;
    listed: Record<string, IMarketListedItem>,
    sold: Record<string, IMarketSoldItem>,

}
const CompareResults = ({
    loading,
    listed,
    sold,
}: Props) => {
    const [hasValidlisted, setHasValidListed] = useState(false);
    const [hasValidSold, setHasValidSold] = useState(false);

    const platform = Object.keys(listed)[0] || Object.keys(sold)[0];
    const [currentListed, setCurrentListed] = useState<IMarketListedItem>(Object.values(listed)[0]);
    const [currentSold, setCurrentSold] = useState<IMarketSoldItem>(Object.values(sold)[0]);
    const [selectedPlatform, setSelectedPlatform] = useState<string>(platform);

    useEffect(() => {
        const validListed = listed[selectedPlatform];
        const validSold = sold[selectedPlatform];

        setCurrentListed(validListed);
        setCurrentSold(validSold);

        setHasValidListed(!(!validListed));
        setHasValidSold(!(!validSold));

    }, [selectedPlatform, listed, sold])


    // Get all unique platforms from listed and sold results
    const allPlatforms = Array.from(new Set([
        ...Object.keys(listed),
        ...Object.keys(sold),
    ]));


    return (
        <Layout style={{ flex: 1, backgroundColor: Colors.background }}>
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" />
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
                                    <Text category="h3" style={{ marginVertical: 8, color: Colors.textSubtitle }}>Currently Listed</Text>
                                    {["ebay"].includes(selectedPlatform) && (
                                        <CardGrid item={currentListed} />
                                    )}
                                </View>
                            )}
                            {hasValidSold && (
                                <View style={{ backgroundColor: Colors.background }}>
                                    <Text category="h3" style={{ marginVertical: 8, color: Colors.textSubtitle }}>Previously Sold</Text>
                                    {["ebay"].includes(selectedPlatform) && (
                                        <CardGrid item={currentSold} />
                                    )}
                                </View>
                            )}
                        </ScrollView>
                    )}

                    {/* Bottom Tab Bar */}
                    <View
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            flexDirection: 'row',
                            height: 50,
                            alignItems: 'center',
                            justifyContent: 'space-around',
                            paddingHorizontal: 10,
                        }}
                    >
                        {allPlatforms.map((platform) => (
                            <TouchableOpacity style={{ backgroundColor: selectedPlatform === platform ? Colors.cardSelectedBackground : Colors.cardBackground, padding: 12, borderRadius: 12, borderWidth: 1 }} key={platform} onPress={() => setSelectedPlatform(platform)}>
                                <Text
                                    style={{
                                        color: 'black',
                                        fontWeight: selectedPlatform === platform ? 'bold' : 'normal',
                                    }}
                                >
                                    {mapAccountToAccountName[platform]}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity style={{ backgroundColor: Colors.cardBackground, padding: 12, borderRadius: 12, borderWidth: 1, }} key={"stockx"} onPress={() => setSelectedPlatform("stockx")}>
                            <Text
                                style={{
                                    color: 'black',
                                    fontWeight: selectedPlatform === "stockx" ? 'bold' : 'normal',
                                }}
                            >
                                StockX
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: Colors.cardBackground, padding: 12, borderRadius: 12, borderWidth: 1, }} key={"laced"} onPress={() => setSelectedPlatform("laced")}>
                            <Text
                                style={{
                                    color: 'black',
                                    fontWeight: selectedPlatform === "laced" ? 'bold' : 'normal',
                                }}
                            >
                                Laced
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: Colors.cardBackground, padding: 12, borderRadius: 12, borderWidth: 1, }} key={"alias"} onPress={() => setSelectedPlatform("alias")}>
                            <Text
                                style={{
                                    color: 'black',
                                    fontWeight: selectedPlatform === "alias" ? 'bold' : 'normal',
                                }}
                            >
                                Alias
                            </Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </Layout>
    );
};

export default CompareResults;
