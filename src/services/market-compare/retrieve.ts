// Local Imports
import { IMarketItem } from "@/src/models/market-compare";
import { IListing } from "@/src/models/store-data";
import { IUser } from "@/src/models/user";
import { scrapeListed as ebayListed, scrapeSold as ebaySold } from "@/src/services/market-compare/ebay";
import { scrapeListed as stockXListed } from "@/src/services/market-compare/stockx";

// External Imports

export async function retrieveMarketItem({ user, query }: { user: IUser, query: string }): Promise<{ item?: IMarketItem, error?: any }> {
    const currency = user.preferences?.currency as string;

    const listing: IListing = {
        condition: "Brand New",
        currency,
        initialQuantity: 1,
        quantity: 1,
        recordType: "manual",
    }
    const marketItem: IMarketItem = { ebay: {} }

    try {
        const { item: stockxItem } = await stockXListed({ uid: user.id as string, query });

        listing.name = stockxItem?.title;
        listing.sku = stockxItem?.styleId;
        listing.extra = {
            "Gender": stockxItem?.productAttributes.gender as string,
            "Color": stockxItem?.productAttributes.color as string,
            "Brand": stockxItem?.brand as string
        }

    } catch (err) {
        console.error(`Error fetch StockX data`, err);
    }

    let searchQuery;
    if (query.length > 10) {
        searchQuery = query;
    } else {
        searchQuery = listing.name || query;
    }

    // Listed eBay data
    try {
        const { item: ebayItem } = await ebayListed({ query: searchQuery, currency });

        if (marketItem.ebay !== undefined) {
            marketItem.ebay.listed = ebayItem;
            listing.price = ebayItem?.price?.mean;
            listing.purchase = {};
            listing.purchase.price = ebayItem?.price?.mean;
            if (ebayItem?.image) {
                listing.image = [ebayItem?.image]
            }
        }
    } catch (err) {
        console.error(`Error fetch listed eBay data`, err);
    }

    // Sold eBay data
    try {
        const { item: ebayItem } = await ebaySold({ query: searchQuery, currency });

        if (marketItem.ebay !== undefined) {
            marketItem.ebay.sold = ebayItem;
            listing.price = ebayItem?.price?.mean || listing.price;
            if (ebayItem?.image) {
                listing.image = listing.image || [ebayItem?.image]
            }
        }

    } catch (err) {
        console.error(`Error fetch sold eBay data`, err);
    }


    marketItem.listing = listing;
    return { item: marketItem };
}