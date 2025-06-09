import { usersCol } from "../firebase/constants";
import { firestore } from "@/src/config/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

interface Props {
    store: string;
    tokenData: {
        access_token: string;
        refresh_token: string;
        id_token?: string;
        expires_in: number;
        error?: string;
        error_description?: string;
    };
    uid: string;
}

async function addToken({ store, tokenData, uid }: Props) {
    try {
        const userRef = doc(firestore, usersCol, uid);
        const userSnapshot = await getDoc(userRef);

        // Build the updated fields
        const updatedFields: Record<string, any> = {
            [`connectedAccounts.${store}.accessToken`]: tokenData.access_token,
            [`connectedAccounts.${store}.refreshToken`]: tokenData.refresh_token,
            [`connectedAccounts.${store}.tokenExpiry`]: Date.now() + tokenData.expires_in * 1000,
        };

        if (!tokenData.access_token || !tokenData.refresh_token || !tokenData.expires_in) {
            throw new Error(`Invalid token data: Missing required fields.`);
        }

        if (store === "stockx" && tokenData.id_token) {
            updatedFields[`connectedAccounts.${store}.idToken`] = tokenData.id_token;
        }

        if (userSnapshot.exists()) {
            const userData = userSnapshot.data() as Record<string, any>;

            // If connectedAccounts or this specific account object doesn’t exist, set it to an empty object
            if (
                !userData.connectedAccounts ||
                userData.connectedAccounts[store] == null
            ) {
                await updateDoc(userRef, {
                    [`connectedAccounts.${store}`]: {},
                });
            }
        } else {
            // If user document doesn't exist, create it with the connectedAccounts object
            await setDoc(
                userRef,
                { connectedAccounts: { [store]: {} } },
                { merge: true }
            );
        }

        // Finally, update the token fields under connectedAccounts.store
        await updateDoc(userRef, updatedFields);

        return { success: true };
    } catch (error) {
        console.error("Error adding tokens:", error);
        return {
            error: `An error occurred while adding tokens: ${error}, Access Token: ${tokenData.access_token}, Refresh Token: ${tokenData.refresh_token}, Expiry: ${tokenData.expires_in}, Error: ${tokenData.error}, Error Description: ${tokenData.error_description}`,
        };
    }
}

export { addToken };
