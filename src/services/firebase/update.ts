import { IUser } from "@/src/models/user";
import { addToken } from "../oauth/add-token";
import { DateFilterKeyType, HardcodedStoreType, ItemType, RootColType, SubColType } from "./models";
import { accountToRefreshFunc } from "../oauth/utils";
import { extractItemDateByFilter, extractItemId } from "./extract";
import { firestore } from "@/src/config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { formatDateToISO } from "@/src/utils/format";
import { retrieveItemsFromDB } from "./retrieve";
import { colDataFetched, getCachedData, getLastVisibleCacheData, setLastVisibleCacheData } from "@/src/utils/cache-helpers";


export async function checkAndRefreshTokens({
    user,
}: {
    user: IUser;
}): Promise<{ success?: boolean; error?: any }> {
    try {
        const accounts = user.connectedAccounts as Record<string, unknown> | undefined;
        if (!accounts) {
            return { success: true };
        }

        for (const [store, data] of Object.entries(accounts)) {
            if (!data) continue;

            const accountData = data as Record<string, any>;
            const expiresData = accountData[`${store}TokenExpiry`];
            const refreshToken = accountData[`${store}RefreshToken`];
            if (!refreshToken) continue;

            // Skip if token does not expire within the next 30 minutes
            const now = Date.now();
            const expiry =
                typeof expiresData === "number" && expiresData < 1e12
                    ? expiresData * 1000
                    : expiresData;
            const THIRTY_MINUTES = 30 * 60 * 1000;
            if (expiry && expiry > now + THIRTY_MINUTES) {
                continue;
            }

            const typedPlatform = store as HardcodedStoreType;
            const refreshFn = accountToRefreshFunc[typedPlatform];
            if (!refreshFn) continue;

            try {
                const tokenData = await refreshFn({ refresh_token: refreshToken });
                if (tokenData) {
                    const { error: addTokenError } = await addToken({
                        uid: user.id as string,
                        store,
                        tokenData,
                    });
                    if (addTokenError) throw new Error(addTokenError as string);
                }
            } catch (err) {
                console.error(`Error refreshing token for ${store}:`, err);
                continue;
            }
        }

        return { success: true };
    } catch (error) {
        console.error("Error refreshing tokens:", error);
        return { error: `${error}` };
    }
}


export async function updateItem({ uid, item, rootCol, subCol }: { uid: string, item: ItemType, rootCol: RootColType, subCol: SubColType}) {
    try {
        // Step 1: Extract Item ID
        const id = extractItemId({ item });
        if (!id) throw Error(`Item does not contain an ID`);

        // Step 2: Retrieve document reference
        const docRef = doc(firestore, rootCol, uid, subCol, id);
        if (!docRef) throw Error(`No item found with ID: ${id}`)

        // Step 3: Update item
        await updateDoc(docRef, { ...item });

    } catch (error) {
        console.error("Error updateItem:", error);
        throw error;
    }
}


interface UpdateCachedItemsProps {
    uid: string;
    rootCol: RootColType;
    subCol: SubColType;
    cacheKey: string;
    filterKey: DateFilterKeyType;
    timeFrom: string;
    timeTo?: string;
    update?: boolean;
    searchFields?: string[];
    searchText?: string;
    pagenate?: boolean;
    nextPage?: boolean;
}
export async function updateCachedItems({ uid, rootCol, subCol, searchFields, searchText, cacheKey, filterKey, timeFrom, timeTo, update, pagenate, nextPage }: UpdateCachedItemsProps): Promise<ItemType[]> {
    try {
        // Step 1: Retrieve cache
        const cacheData = await getCachedData(cacheKey, true);
        const isColDataFetched = await colDataFetched(cacheKey, subCol);

        // Step 2: Extract cache data
        const cache = cacheData?.data ? Object.values(cacheData.data) : [];
        const cacheTimeFrom = cacheData?.cacheTimeFrom ? new Date(cacheData.cacheTimeFrom) : undefined;
        const cacheTimeTo = cacheData?.cacheTimeTo ? new Date(cacheData.cacheTimeTo) : undefined;

        // Step 3: Create date objects with timeFrom and timeTo
        const timeFromDate = new Date(timeFrom);
        const timeToDate = timeTo ? new Date(timeTo) : new Date();

        let newTimeFrom = timeFrom;
        let newTimeTo = timeTo ? timeTo : formatDateToISO(new Date());

        // Step 4: If cache exists then only request new data if timeFrom & timeTo are out of range of the cache
        if (cache && cache.length > 0 && !update && !nextPage && isColDataFetched) {
            // Step 5: Extract cache items
            const firstItem = cache[0];
            const lastItem = cache[cache.length - 1];

            // Step 6: Determine the oldest & newest filter dates in the cache
            const oldestTime = cacheTimeFrom ?? new Date(extractItemDateByFilter({ item: lastItem, filterKey }));
            const newestTime = cacheTimeTo ?? new Date(extractItemDateByFilter({ item: firstItem, filterKey }));

            // Step 7: Check if requested times are within the cached data range
            if (timeFromDate >= oldestTime && timeToDate <= newestTime) return [];

            // Step 8: Check if timeFrom is older then the oldest cached data item
            if (timeFromDate < oldestTime && timeToDate <= newestTime) {
                newTimeFrom = timeFrom;
                newTimeTo = oldestTime.toISOString();
            }

            // Step 9: Check if timeTo is newer then the newest cached data item
            else if (timeFromDate >= oldestTime && timeToDate > newestTime) {
                newTimeFrom = newestTime.toISOString();
                newTimeTo = timeTo ? timeTo : formatDateToISO(new Date());
            }

            // Step 10: Check if timeFrom is older & timeTo is newer
            else if (timeFromDate < oldestTime && timeToDate > newestTime) {
                newTimeFrom = timeFrom;
                newTimeTo = timeTo ? timeTo : formatDateToISO(new Date());
            }

        }
        // Step 11: If the next page is requested
        else if (nextPage) {
            newTimeFrom = timeFrom;
            newTimeTo = timeTo ? timeTo : formatDateToISO(new Date());
        }
        // Step 12: If no cache exists or an update was requested
        else if (update || !cache || cache.length === 0) {
            // Step 13: Request API for new data
            //await updateStoreInfo(rootCol, subCol, uid);

            // Step 14: Set the new times to the requested ones
            newTimeFrom = timeFrom;
            newTimeTo = timeTo ? timeTo : formatDateToISO(new Date());
        }

        // Step 15: Retrieve last visible document snapshot from cache
        let lastVisibleSnapshot;
        if (nextPage) {
            lastVisibleSnapshot = await getLastVisibleCacheData(`snapshot-${subCol}-${cacheKey}`);
        }

        // Step 16: Retrieve the new items from the database using the new times
        const { items, lastVisible } = await retrieveItemsFromDB({ uid, rootCol, subCol, filterKey, timeFrom: newTimeFrom, timeTo: newTimeTo, pagenate, lastDoc: lastVisibleSnapshot });

        // Step 17: Update the last visible snapshot in cache
        if (lastVisible) {
            await setLastVisibleCacheData(`snapshot-${subCol}-${cacheKey}`, lastVisible);
        }

        return Object.values(items);
    } catch (error) {
        console.error(`Error in retrieveItemsFromDB`, error);
        throw new Error(`${error}`);
    }
}
