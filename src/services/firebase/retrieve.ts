// Local Imports
import { IUser } from "@/src/models/user";
import { usersCol } from './constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firestore } from "@/src/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { CACHE_PREFIX } from "@/src/utils/contants";


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
