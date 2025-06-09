import { HardcodedStoreType } from "../firebase/models";
import { refreshEbayToken } from "./ebay/refresh-token";
import { refreshStockXToken } from "./stockx/refresh-token";

export const accountToRefreshFunc: Record<
    HardcodedStoreType,
    (args: { refresh_token: string }) => Promise<{
        access_token: string;
        refresh_token: string;
        id_token: string;
        expires_in: number;
        error?: string;
        error_description?: string;
    }>
> = {
    ebay: refreshEbayToken,
    stockx: refreshStockXToken,
};