"use client";

// Local Imports
import { IOneTimeExpense, ISubscriptionExpense } from "@/src/models/expenses";
import { IListing, IOrder } from "@/src/models/store-data";
import { getCachedData, retrieveCacheItem, setCachedData, setCacheItem } from "@/src/utils/cache-helpers";
import { inventoryCacheKey, oneTimeExpensesCacheKey, orderCacheKey, subColsCacheKey, subscriptionsExpensesCacheKey } from "@/src/utils/contants";
import { filterItemsByDate } from "@/src/utils/filters";
import { retrieveStoreTypes } from "../api/retrieve-storetypes";
import { expensesCol, expensesFilterKey, inventoryCol, inventoryFilterKey, oneTimeCol, ordersCol, ordersFilterKey, subscriptionsExpenseCol } from "../firebase/constants";
import { extractItemDateByFilter, extractItemId } from "../firebase/extract";
import { DateFilterKeyType, ItemType, RootColType, STORES, SubColFilter, SubColType } from "../firebase/models";
import { retrieveConnectedAccounts, retrieveIdToken } from "../firebase/retrieve";
import { updateCachedItems } from "../firebase/update";


interface RetrieveProps {
    uid: string;
    timeFrom: string;
    timeTo?: string;
    subCol?: string;
    searchFields?: string[];
    searchText?: string;
    pagenate?: boolean;
    nextPage?: boolean;
    update?: boolean;
}

export async function retrieveOrders({ uid, timeFrom, timeTo, subCol, searchFields, searchText, pagenate, nextPage, update }: RetrieveProps): Promise<IOrder[] | void> {
    return await retrieveItems({
        uid,
        rootCol: ordersCol,
        cacheKey: `${orderCacheKey}-${uid}`,
        filterKey: ordersFilterKey,
        timeFrom,
        timeTo,
        subColFilter: ordersCol,
        subCol,
        searchFields,
        searchText,
        pagenate,
        nextPage,
        update
    }) as IOrder[];
}

export async function retrieveInventory({ uid, timeFrom, timeTo, subCol, searchFields, searchText, pagenate, nextPage, update }: RetrieveProps): Promise<IListing[] | void> {
    return await retrieveItems({
        uid,
        rootCol: inventoryCol,
        cacheKey: `${inventoryCacheKey}-${uid}`,
        filterKey: inventoryFilterKey,
        timeFrom,
        timeTo,
        subColFilter: inventoryCol,
        subCol,
        searchFields,
        searchText,
        pagenate,
        nextPage,
        update
    });
}

export async function retrieveOneTimeExpenses({ uid, timeFrom, timeTo, subCol, searchFields, searchText, pagenate, nextPage, update }: RetrieveProps): Promise<IOneTimeExpense[] | void> {
    return await retrieveItems({
        uid,
        rootCol: expensesCol,
        cacheKey: `${oneTimeExpensesCacheKey}-${uid}`,
        filterKey: expensesFilterKey,
        timeFrom,
        timeTo,
        subColFilter: oneTimeCol,
        subCol,
        searchFields,
        searchText,
        pagenate,
        nextPage,
        update
    }) as IOneTimeExpense[];
}

export async function retrieveSubscriptionExpenses({ uid, timeFrom, timeTo, subCol, searchFields, searchText, pagenate, nextPage, update }: RetrieveProps): Promise<ISubscriptionExpense[] | void> {
    return await retrieveItems(
        {
            uid,
            rootCol: expensesCol,
            cacheKey: `${subscriptionsExpensesCacheKey}-${uid}`,
            filterKey: expensesFilterKey,
            timeFrom,
            timeTo,
            subColFilter: subscriptionsExpenseCol,
            subCol,
            searchFields,
            searchText,
            pagenate,
            nextPage,
            update
        }) as ISubscriptionExpense[];
}

interface RetrieveItemsProps {
    uid: string;
    rootCol: RootColType;
    cacheKey: string;
    filterKey: DateFilterKeyType;
    subColFilter: SubColFilter;
    timeFrom: string;
    timeTo?: string;
    subCol?: string;
    searchFields?: string[];
    searchText?: string;
    pagenate?: boolean;
    nextPage?: boolean;
    update?: boolean;
}
export async function retrieveItems({ uid, rootCol, cacheKey, filterKey, timeFrom, timeTo, subColFilter, subCol, searchFields, searchText, pagenate, nextPage, update }: RetrieveItemsProps): Promise<ItemType[] | void> {
    try {
        // Step 1: Retrieve sub collections
        const { cols: subCols, error } = await retrieveSubCols({ uid, subColFilter, subCol });
        if (error) throw error;

        // Step 2: Retrieve all items within the time ranges
        const subColResults = await Promise.all(
            subCols.map((col) =>
                updateCachedItems({
                    uid,
                    rootCol,
                    subCol: col,
                    cacheKey,
                    filterKey,
                    timeFrom,
                    timeTo,
                    searchFields,
                    searchText,
                    pagenate,
                    nextPage,
                    update
                })
            )
        );

        // Step 3: Combine results into a dictionary
        const mergedData: Record<string, ItemType> = {};

        // Step 4: Merge existing cached data
        const cache = await getCachedData(cacheKey) as { data: Record<string, ItemType> } | undefined;
 
        if (cache?.data) {
            Object.assign(mergedData, cache.data);
        }

        // Step 5: Merge new results
        subColResults.forEach((result) => {
            if (result) {
                result.forEach((item) => {
                    const id = extractItemId({ item });
                    if (id) mergedData[id] = item;
                });
            }
        });

        // Step 6: Convert to array and sort
        const mergedArray = Object.values(mergedData).sort((a, b) => {
            const dateA = extractItemDateByFilter({ item: a, filterKey });
            const dateB = extractItemDateByFilter({ item: b, filterKey });

            if (!dateA && !dateB) return 0;
            if (!dateA) return 1;
            if (!dateB) return -1;

            return new Date(dateB).getTime() - new Date(dateA).getTime();
        });

        // Step 7: Write the full merged cache back once
        await setCachedData(cacheKey, mergedData, new Date(timeFrom), timeTo ? new Date(timeTo) : new Date());

        // Step 8: Filter by subCol if provided
        const filteredItems = subCol
            ? mergedArray.filter((item) => (item as any)?.storeType === subCol)
            : mergedArray;

        // Step 9: Filter by date range
        const dateFiltered = filterItemsByDate({ items: filteredItems, filterKey, timeFrom, timeTo });

        // 9.2: *Then* run in-memory search filter (substring, case-insensitive)
        const final = searchText && searchFields?.length
            ? dateFiltered.filter(item => {
                const lower = searchText.toLowerCase();
                return searchFields.some(field => {
                    const val = (item as any)[field];
                    return typeof val === "string" && val.toLowerCase().includes(lower);
                });
            })
            : dateFiltered;

        return final;
    } catch (error) {
        console.log(`Error in retrieveItems: ${error}`);
    }
}

export async function retrieveSubCols({ uid, subColFilter, subCol }: { uid: string, subColFilter: SubColFilter, subCol?: string }): Promise<{ cols: SubColType[], error?: string }> {
    const subCols: SubColType[] = [];
    const cacheKey = `${subColsCacheKey}-${uid}`;

    const cache = await retrieveCacheItem(cacheKey);
    if (cache) return { cols: cache as SubColType[] };

    if (subCol) {
        return { cols: [subCol] }
    }

    try {
        if (subColFilter === "oneTime") {
            subCols.push(oneTimeCol);

        } else if (subColFilter === "subscriptions") {
            subCols.push(subscriptionsExpenseCol);

        } else if (subColFilter === inventoryCol || subColFilter === ordersCol) {
            const idToken = await retrieveIdToken();
            if (!idToken) throw Error("No/Invalid id token found");
            // Step 2: Retrieve all store types
            const { storeTypes } = await retrieveStoreTypes({ idToken, subColFilter });
            if (storeTypes === undefined) throw Error("Error fetching store types");

            // Step 3: Retrieve connected accounts
            const connectedAccounts = await retrieveConnectedAccounts({ uid });

            // Step 4: Loop through each connected account entry
            for (const [name, value] of Object.entries(connectedAccounts ?? {})) {
                if (STORES.includes(name) && value) {
                    subCols.push(name);
                }
            }

            // Step 5: Loop through each store type
            for (const name of storeTypes) {
                if (!subCols.includes(name)) {
                    subCols.push(name);
                }
            }
        }

        await setCacheItem(cacheKey, subCols)
        return { cols: subCols };
    } catch (error) {
        console.log(`Error in retrieveSubCols: ${error}`);
        return { cols: subCols, error: `${error}` };
    }
}

export async function retrieveOrderStoreTypes({ idToken }: { idToken: string }): Promise<string[] | void> {
    try {
        const { storeTypes } = await retrieveStoreTypes({ idToken, subColFilter: ordersCol });
        return storeTypes
    } catch (error) {
        console.log(`Error in retrieveOrderStoreTypes: ${error}`);
    }
}
