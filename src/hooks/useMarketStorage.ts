import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useState } from 'react';
import { MARKET_ITEM_CACHE_PREFIX } from '../utils/contants';

type Nullable<T> = T | undefined;

interface Entry<T> {
    data: T;
    timestamp: number;
}

export function useMarketStorage<T>() {
    const [store, setStore] = useState<Record<string, Entry<T>>>({});

    /**
     * Always reads fresh from AsyncStorage (store is optional in this case).
     */
    const getItem = useCallback(async (key: string): Promise<Nullable<T>> => {
        try {
            const raw = await AsyncStorage.getItem(key);
            if (raw != null) {
                const entry: Entry<T> = JSON.parse(raw);
                setStore(s => ({ ...s, [key]: entry }));
                return entry.data;
            }
        } catch (err) {
            console.error(`useStorage.getItem failed for key "${key}"`, err);
        }
        return undefined;
    }, []);

    const setItem = useCallback(async (key: string, data: T) => {
        try {
            const entry: Entry<T> = { data, timestamp: Date.now() };
            setStore(s => ({ ...s, [key]: entry }));

            const allKeys = await AsyncStorage.getAllKeys();
            const recentKeys = allKeys.filter(k => k.startsWith(MARKET_ITEM_CACHE_PREFIX));
            const stores = await AsyncStorage.multiGet(recentKeys);

            let entries: { key: string; timestamp: number }[] = [];

            for (const [storedKey, raw] of stores) {
                if (!raw) continue;
                try {
                    const parsed: Entry<T> = JSON.parse(raw);
                    entries.push({ key: storedKey, timestamp: parsed.timestamp });
                } catch {
                    // skip invalid entry
                }
            }

            // If there are 25 or more entries, remove the oldest one
            if (entries.length >= 25) {
                entries.sort((a, b) => a.timestamp - b.timestamp); // oldest first
                const oldestKey = entries[0].key;

                if (oldestKey !== key) {
                    await AsyncStorage.removeItem(oldestKey);
                }
            }

            await AsyncStorage.setItem(key, JSON.stringify(entry));
        } catch (err) {
            console.error(`useStorage.setItem failed for key "${key}"`, err);
        }
    }, []);

    const removeItem = useCallback(async (key: string) => {
        try {
            setStore(s => {
                const next = { ...s };
                delete next[key];
                return next;
            });
            await AsyncStorage.removeItem(key);
        } catch (err) {
            console.error(`useStorage.removeItem failed for key "${key}"`, err);
        }
    }, []);

    const updateItem = useCallback(async (key: string, data: T, updateTimestamp: boolean = false) => {
        try {
            const raw = await AsyncStorage.getItem(key);
            if (raw == null) {
                console.warn(`useStorage.updateItem: No entry found for key "${key}"`);
                return;
            }

            const existingEntry: Entry<T> = JSON.parse(raw);
            const updatedEntry: Entry<T> = {
                data,
                timestamp: updateTimestamp ? Date.now() : existingEntry.timestamp,
            };

            setStore(s => ({ ...s, [key]: updatedEntry }));
            await AsyncStorage.setItem(key, JSON.stringify(updatedEntry));
        } catch (err) {
            console.error(`useStorage.updateItem failed for key "${key}"`, err);
        }
    }, []);


    const getAllItems = useCallback(async (): Promise<{ query: string; item: T; timestamp: number }[]> => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const recentKeys = keys.filter(k => k.startsWith(MARKET_ITEM_CACHE_PREFIX));
            const stores = await AsyncStorage.multiGet(recentKeys);

            const items: { query: string; item: T; timestamp: number }[] = [];

            for (const [key, raw] of stores) {
                if (!raw) continue;
                try {
                    const entry: Entry<T> = JSON.parse(raw);
                    items.push({
                        query: key.slice(MARKET_ITEM_CACHE_PREFIX.length),
                        item: entry.data,
                        timestamp: entry.timestamp,
                    });
                } catch {
                    // Invalid JSON or shape — skip it
                }
            }

            items.sort((a, b) => b.timestamp - a.timestamp);
            return items;
        } catch (err) {
            console.error('getAllItems failed', err);
            return [];
        }
    }, []);

    return {
        getItem,
        setItem,
        removeItem,
        updateItem,
        getAllItems,
        store,
    };
}
