// Local Imports
import { auth, firestore } from "@/src/config/firebase";
import { IUser } from "@/src/models/user";
import { CACHE_PREFIX } from "@/src/utils/contants";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, doc, documentId, getDoc, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { usersCol } from './constants';
import { extractItemDateByFilter, extractItemId } from "./extract";
import { DateFilterKeyType, HardcodedStoreType, ItemType, RootColType, SubColType } from "./models";


export async function retrieveUser({ uid, refresh }: { uid: string, refresh?: boolean }): Promise<IUser | void> {
    try {
        // Step 1: Try to get cached user from AsyncStorage
        const cachedUser = await AsyncStorage.getItem(CACHE_PREFIX + uid);
        if (cachedUser && !refresh) {
            return JSON.parse(cachedUser) as IUser;
        }

        // Step 2: Not cached? Fetch from Firestore
        const docRef = doc(firestore, usersCol, uid);
        const userDoc = await getDoc(docRef);

        if (userDoc.exists()) {
            const userData = userDoc.data() as IUser;

            // Step 3: Cache user data
            await AsyncStorage.setItem(CACHE_PREFIX + uid, JSON.stringify(userData));

            return userData;
        }
    } catch (error) {
        console.error('Error retrieving user from Firestore:', error);
    }
}


export async function retrieveIdToken() {
    try {
        const user = auth.currentUser;
        if (!user) return;

        const idToken = await user?.getIdToken();
        if (!idToken) return;

        return idToken;
    } catch (error) {
        console.error(error)
    }
}


export async function retrieveConnectedAccount({ uid, storeType }: { uid: string, storeType: HardcodedStoreType }) {
    try {
        // Step 1: Retrieve users connected accounts
        const accounts = await retrieveConnectedAccounts({ uid });
        if (!accounts) return;

        return (accounts as Record<string, any>)[storeType];
    } catch (error) {
        console.error(`Error in retrieveConnectedAccount: ${error}`);
        return { error: `${error}` };
    }
}

export async function retrieveConnectedAccounts({ uid }: { uid: string }): Promise<any> {
    try {
        // Step 1: Retrieve document reference
        const docRef = doc(firestore, usersCol, uid);

        // Step 2: Grab the user document
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) throw new Error(`User with UID "${uid}" not found.`);

        // Step 3: Pull out the connectedAccounts object
        const data = snapshot.data();

        return data?.connectedAccounts;
    } catch (error) {
        console.error(`Error in retrieveConnectedAccounts: ${error}`);
        return { error: `${error}` };
    }
}


interface RetrieveItemsFromDBProps {
    uid: string;
    rootCol: RootColType;
    subCol: SubColType;
    filterKey: DateFilterKeyType;
    timeFrom: string;
    timeTo?: string;
    pagenate?: boolean;
    pageLimit?: number;
    lastDoc?: { id: string, date: string } | null;
}
export async function retrieveItemsFromDB({ uid, rootCol, subCol, filterKey, timeFrom, timeTo, pagenate, pageLimit = 48, lastDoc = null }: RetrieveItemsFromDBProps): Promise<{
    items: Record<string, ItemType>;
    lastVisible: { id: string, date: string } | null;
}> {
    const items: Record<string, ItemType> = {};

    try {
        // Step 1: Retrieve collection reference
        const colRef = collection(firestore, rootCol, uid, subCol);

        // Step 2: Build Query
        let q = query(colRef, orderBy(filterKey, "desc"), orderBy(documentId(), "desc"));

        // Step 3: Apply timeFrom filter if provided
        if (timeFrom) {
            q = query(q, where(filterKey, ">=", timeFrom));
        }

        // Step 4: Apply timeTo filter if provided
        if (timeTo) {
            q = query(q, where(filterKey, "<=", timeTo));
        }

        if (pagenate) {
            // Step 5: If a last doc is passed in then apply this to the query
            if (lastDoc) {
                q = query(q, startAfter(lastDoc.date, lastDoc.id));
            }

            // Step 6: Apply query page limit
            q = query(q, limit(pageLimit));
        }

        // Step 7: Query firestore with filters applied
        const snapshot = await getDocs(q);
        if (snapshot.empty) return { items: {}, lastVisible: null };

        // Step 8: Map over documents and extract each item
        snapshot.forEach((doc) => {
            const item = doc.data() as ItemType;
            const id = extractItemId({ item });

            if (id) {
                items[id] = item as ItemType
            };
        });

        // Step 9: Retrieve the last visiable document snapshot
        const itemKeys = Object.keys(items);
        const lastKey = itemKeys[itemKeys.length - 1];
        const lastVisibleItem = items[lastKey] ?? {};
        const lastVisibleId = extractItemId({ item: lastVisibleItem }) as string
        const lastVisibleDate = extractItemDateByFilter({ item: lastVisibleItem, filterKey }) as string;

        return { items, lastVisible: { id: lastVisibleId, date: lastVisibleDate } };
    } catch (error) {
        console.error(`Error in retrieveItemsFromDB`, error);
        throw new Error(`${error}`);
    }
}