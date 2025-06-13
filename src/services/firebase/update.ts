import { IUser } from "@/src/models/user";
import { addToken } from "../oauth/add-token";
import { HardcodedStoreType, ItemType, RootColType, SubColType } from "./models";
import { accountToRefreshFunc } from "../oauth/utils";
import { extractItemId } from "./extract";
import { firestore } from "@/src/config/firebase";
import { doc, updateDoc } from "firebase/firestore";


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
