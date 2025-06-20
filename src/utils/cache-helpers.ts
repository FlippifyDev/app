import { StoreType } from '@/src/models/store-data';
import { extractItemDate, extractItemId } from '@/src/services/firebase/extract';
import { ItemType } from '@/src/services/firebase/models';
import { cacheExpirationTime } from '@/src/utils/contants';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Stored cache shape
 */
type ItemCacheType = {
    data: Record<string, ItemType>;
    cacheTimeFrom?: string;
    cacheTimeTo?: string;
    timestamp: number;
    lastVisible?: any;
};

/**
 * Retrieve cached data if not expired.
 * @param key storage key
 * @param returnCacheTimes include time bounds
 */
export async function getCachedData(
    key: string,
    returnCacheTimes = false
): Promise<ItemCacheType | void> {
    try {
        const raw = await AsyncStorage.getItem(key);
        if (!raw) return;
        const parsed: ItemCacheType = JSON.parse(raw);
        if (Date.now() - parsed.timestamp >= cacheExpirationTime) {
            // expired
            await AsyncStorage.removeItem(key);
            return;
        }
        if (returnCacheTimes) {
            return parsed;
        } else {
            return { data: parsed.data, timestamp: parsed.timestamp } as ItemCacheType;
        }
    } catch (e) {
        console.error(`getCachedData(${key}) failed`, e);
    }
}

/**
 * Persist cache time bounds only
 */
export async function setCachedTimes(
    key: string,
    timeFrom?: Date,
    timeTo?: Date
): Promise<void> {
    try {
        const raw = await AsyncStorage.getItem(key);
        const base: Partial<ItemCacheType> = raw ? JSON.parse(raw) : {};
        const updated: ItemCacheType = {
            data: base.data || {},
            timestamp: base.timestamp || Date.now(),
            cacheTimeFrom: timeFrom?.toISOString() || base.cacheTimeFrom,
            cacheTimeTo: timeTo?.toISOString() || base.cacheTimeTo,
            lastVisible: base.lastVisible,
        };
        await AsyncStorage.setItem(key, JSON.stringify(updated));
    } catch (e) {
        console.error(`setCachedTimes(${key}) failed`, e);
    }
}

/**
 * Get only time bounds
 */
export async function getCachedTimes(
    key: string
): Promise<{
    cacheTimeFrom?: string;
    cacheTimeTo?: string;
} | null> {
    try {
        const raw = await AsyncStorage.getItem(key);
        if (!raw) return null;
        const parsed: Partial<ItemCacheType> = JSON.parse(raw);
        return {
            cacheTimeFrom: parsed.cacheTimeFrom,
            cacheTimeTo: parsed.cacheTimeTo,
        };
    } catch (e) {
        console.error(`getCachedTimes(${key}) failed`, e);
        return null;
    }
}

/**
 * Set full cache data (data + timestamps)
 */
export async function setCachedData(
    key: string,
    data: Record<string, ItemType>,
    cacheTimeFrom?: Date,
    cacheTimeTo?: Date
): Promise<void> {
    try {
        const times = await getCachedTimes(key);
        const fromISO = cacheTimeFrom?.toISOString() || times?.cacheTimeFrom;
        const toISO = cacheTimeTo?.toISOString() || times?.cacheTimeTo;
        const entry: ItemCacheType = {
            data,
            timestamp: Date.now(),
            cacheTimeFrom: fromISO,
            cacheTimeTo: toISO,
        };
        await setCachedTimes(key, cacheTimeFrom, cacheTimeTo);
        await AsyncStorage.setItem(key, JSON.stringify(entry));
    } catch (e) {
        console.error(`setCachedData(${key}) failed`, e);
    }
}

/**
 * Merge and sort new items into existing cache
 */
export async function addCacheData(
    key: string,
    data: Record<string, ItemType>
): Promise<void> {
    try {
        const existing = await getCachedData(key, true);
        const baseData = existing?.data ?? {};
        const merged = { ...baseData, ...data };
        // sort by date desc
        const sorted = Object.values(merged)
            .sort((a, b) => {
                const da = new Date(extractItemDate({ item: a }) || 0).getTime();
                const db = new Date(extractItemDate({ item: b }) || 0).getTime();
                return db - da;
            })
            .reduce<Record<string, ItemType>>((acc, item) => {
                const id = extractItemId({ item });
                if (id) acc[id] = item;
                return acc;
            }, {});

        const entry: ItemCacheType = {
            data: sorted,
            timestamp: Date.now(),
            cacheTimeFrom: existing?.cacheTimeFrom,
            cacheTimeTo: existing?.cacheTimeTo,
        };
        await setCachedTimes(key, existing?.cacheTimeFrom ? new Date(existing.cacheTimeFrom) : undefined,
            existing?.cacheTimeTo ? new Date(existing.cacheTimeTo) : undefined);
        await AsyncStorage.setItem(key, JSON.stringify(entry));
    } catch (e) {
        console.error(`addCacheData(${key}) failed`, e);
    }
}

/**
 * Update a single item in cache
 */
export async function updateCacheData(
    key: string,
    item: ItemType
): Promise<void> {
    try {
        const id = extractItemId({ item });
        if (!id) return;
        const existing = await getCachedData(key, true);
        if (existing) {
            const updated = { ...existing.data, [id]: item };
            const entry: ItemCacheType = {
                ...existing,
                data: updated,
            };
            await AsyncStorage.setItem(key, JSON.stringify(entry));
        } else {
            // create new cache
            await setCachedData(key, { [id]: item });
        }
    } catch (e) {
        console.error(`updateCacheData(${key}) failed`, e);
    }
}

/**
 * Remove an item from cache
 */
export async function removeCacheData(
    key: string,
    itemKey: string
): Promise<void> {
    try {
        const existing = await getCachedData(key, true);
        if (!existing) return;
        const cloned = { ...existing.data };
        delete cloned[itemKey];
        const entry: ItemCacheType = {
            ...existing,
            data: cloned,
        };
        await AsyncStorage.setItem(key, JSON.stringify(entry));
    } catch (e) {
        console.error(`removeCacheData(${key}) failed`, e);
    }
}

/**
 * Get a single item from cache
 */
export async function getCachedItem(
    key: string,
    itemKey: string
): Promise<ItemType | null> {
    try {
        const raw = await AsyncStorage.getItem(key);
        if (!raw) return null;
        const parsed: ItemCacheType = JSON.parse(raw);
        return parsed.data[itemKey] ?? null;
    } catch (e) {
        console.error(`getCachedItem(${key}, ${itemKey}) failed`, e);
        return null;
    }
}

/**
 * Track which sub-collections/types have been fetched
 */
export async function colDataFetched(
    cacheKey: string,
    storeType: StoreType
): Promise<boolean> {
    const key = `${cacheKey}-store`;
    try {
        const raw = await AsyncStorage.getItem(key);
        const arr: StoreType[] = raw ? JSON.parse(raw) : [];
        if (arr.includes(storeType)) return true;
        arr.push(storeType);
        await AsyncStorage.setItem(key, JSON.stringify(arr));
        return false;
    } catch (e) {
        console.error(`colDataFetched(${cacheKey}) failed`, e);
        return false;
    }
}

/**
 * Store / retrieve Firestore lastVisible snapshot
 */
export async function setLastVisibleCacheData(
    cacheKey: string,
    data: any
): Promise<void> {
    try {
        const raw = await AsyncStorage.getItem(cacheKey);
        const base: any = raw ? JSON.parse(raw) : {};
        base.lastVisible = data;
        await AsyncStorage.setItem(cacheKey, JSON.stringify(base));
    } catch (e) {
        console.error(`setLastVisibleCacheData(${cacheKey}) failed`, e);
    }
}

export async function getLastVisibleCacheData(
    cacheKey: string
): Promise<any | null> {
    try {
        const raw = await AsyncStorage.getItem(cacheKey);
        if (!raw) return null;
        const parsed: any = JSON.parse(raw);
        return parsed.lastVisible ?? null;
    } catch (e) {
        console.error(`getLastVisibleCacheData(${cacheKey}) failed`, e);
        return null;
    }
}


export async function retrieveCacheItem(cacheKey: string) {
    try {
        const raw = await AsyncStorage.getItem(cacheKey);
        if (!raw) return null;
        const parsed: { data: any, expiration: Date } = JSON.parse(raw);

        // Compare current time with expiration
        const currentTime = new Date();
        const expirationTime = new Date(parsed.expiration);
        if (currentTime > expirationTime) {
            return null;
        }

        return parsed.data;
    } catch (error) {
        console.error("retrieveCacheItem", error);
        return null;
    }
}


export async function setCacheItem(cacheKey: string, data: any) {
    try {
        // Set expiration to 15 minutes from now
        const expiration = new Date();
        expiration.setMinutes(expiration.getMinutes() + 15);

        // Create cache object with data and expiration
        const cacheObject = {
            data,
            expiration: expiration,
        };

        // Serialize and store in AsyncStorage
        await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheObject));
        return true; // Indicate success
    } catch (error) {
        console.error("setCacheItem", error);
        return null;
    }
}