// Local Imports
import { auth, firestore } from "@/src/config/firebase";
import { IUser } from "@/src/models/user";
import { CACHE_PREFIX } from "@/src/utils/contants";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc } from "firebase/firestore";
import { usersCol } from './constants';
import { HardcodedStoreType } from "./models";


export async function retrieveUser({ uid }: { uid: string }): Promise<IUser | void> {
    try {
        // Step 1: Try to get cached user from AsyncStorage
        const cachedUser = await AsyncStorage.getItem(CACHE_PREFIX + uid);
        if (cachedUser) {
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