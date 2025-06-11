
import { request_search } from "@/src/lib/oauth/stockx/req";
import { retrieveConnectedAccount } from "../firebase/retrieve";


interface IStockXProductAttributes {
    color: string;
    colorway: string | null;
    gender: string;
    releaseDate: string; // Consider `Date` if you parse it
    retailPrice: number | null;
    season: string;
}

interface IStockXProduct {
    brand: string;
    productAttributes: IStockXProductAttributes;
    productId: string;
    productType: string;
    styleId: string;
    title: string;
    urlKey: string;
  }
export async function scrapeListed({ uid, query }: { uid?: string, query: string }): Promise<{ item?: IStockXProduct, error?: any }> {
    if (!uid) return { error: "No user id provided" };
    try {
        const account = await retrieveConnectedAccount({ uid, storeType: "stockx" });
        if (!account) return { error: "StockX account is likely not connected" };
        const accessToken = account.stockxAccessToken;

        const res = await request_search({ accessToken, query });
        if (res.error) throw res.error;

        const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
        if (!data) return { error: null };

        return { item: data.products[0] };

    } catch (error) {
        console.error(error);
        return { error: `${error}` }
    }
}
