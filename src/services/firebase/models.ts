import { IListing, IOrder } from "@/src/models/store-data";


export const STORES = ["ebay", "stockx"];

export const storeToStoreName = {
    "ebay": "eBay",
    "stockx": "StockX"
}

export type HardcodedStoreType = keyof typeof storeToStoreName;

export type ItemType = IOrder | IListing;
export type SubColType = "oneTime" | "subscriptions" | HardcodedStoreType | string;
export type RootColType = "inventory" | "orders" | "expenses";

export type DateFilterKeyType = "createdAt" | "sale.date" | "dateListed";
export type SubColFilter = "inventory" | "orders" | "oneTime" | "subscriptions";