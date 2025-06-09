import { mapAccountToAccountName } from "@/src/utils/contants";

export const STORES = ["ebay", "stockx"];

export type HardcodedStoreType = keyof typeof mapAccountToAccountName;