import { useUser } from '@/src/hooks/useUser';
import { IMarketListedItem, IMarketSoldItem } from '@/src/models/market-compare';
import CurrencyList from 'currency-list'
import React from 'react';
import { StyleSheet, View } from 'react-native';
import InfoCard from '../../ui/InfoCard';

interface CardGridProps {
    item: IMarketSoldItem | IMarketListedItem;
}

const CardGrid = ({ item }: CardGridProps) => {
    const user = useUser();
    const currency = user?.preferences?.currency ?? "USD";
    const currencySymbol = CurrencyList.get(currency)?.symbol_native;

    function isListedItem(item: IMarketListedItem | IMarketSoldItem): item is IMarketListedItem {
        return 'amount' in item || 'freeDelieveryAmount' in item;
    }

    return (
        <View style={styles.grid}>
            <>
                {isListedItem(item) ? (
                    <View style={styles.cardWrapper}>
                        <InfoCard
                            title="Listed"
                            body={(item.amount ?? 0) > 30 ? `+30` : `${item?.amount}`}
                        />
                        <InfoCard
                            title="Free Shipping"
                            body={(item.freeDelieveryAmount ?? 0) > 30 ? `+30` : `${item?.freeDelieveryAmount}`}
                        />
                        <InfoCard
                            title="Avg Price"
                            body={item.price?.mean ? `${currencySymbol}${item.price?.mean?.toFixed(2)}` : "N/A"}
                        />
                        <InfoCard
                            title="Median Price"
                            body={item.price?.median ? `${currencySymbol}${item.price?.median?.toFixed(2)}` : "N/A"}
                        />
                        <InfoCard
                            title="Min Price"
                            body={item.price?.min ? `${currencySymbol}${item.price?.min?.toFixed(2)}` : "N/A"}
                        />
                        <InfoCard
                            title="Max Price"
                            body={item.price?.max ? `${currencySymbol}${item.price?.max?.toFixed(2)}` : "N/A"}
                        />
                    </View>
                ) : (
                    <View style={styles.cardWrapper}>
                        <InfoCard
                            title="Sales Week"
                            body={(item.sales?.week ?? 0) > 30 ? `+30` : `${item?.sales?.week}`}
                        />
                        <InfoCard
                            title="Sales Month"
                            body={(item.sales?.month ?? 0) > 30 ? `+30` : `${item?.sales?.month}`}
                        />
                        <InfoCard
                            title="Avg Price"
                            body={item.price?.mean ? `${currencySymbol}${item.price?.mean?.toFixed(2)}` : "N/A"}
                        />
                        <InfoCard
                            title="Median Price"
                            body={item.price?.median ? `${currencySymbol}${item.price?.median?.toFixed(2)}` : "N/A"}
                        />
                        <InfoCard
                            title="Min Price"
                            body={item.price?.min ? `${currencySymbol}${item.price?.min?.toFixed(2)}` : "N/A"}
                        />
                        <InfoCard
                            title="Max Price"
                            body={item.price?.max ? `${currencySymbol}${item.price?.max?.toFixed(2)}` : "N/A"}
                        />
                    </View>
                )}
            </>

        </View>
    );
};

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    cardWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        width: '100%',
        gap: 1,
    },

});

export default CardGrid;
