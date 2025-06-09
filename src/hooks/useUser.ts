// Local Imports
import { auth } from "../config/firebase";
import { IUser } from "../models/user";
import { retrieveUser } from "../services/firebase/retrieve";

// External Imports
import { useEffect, useState } from "react";

export function useUser(): IUser | undefined {
    const [user, setUser] = useState<IUser>();

    useEffect(() => {
        let mounted = true;

        async function fetchUser() {
            const uid = auth.currentUser?.uid;
            if (!uid) return;
            const fetchedUser = await retrieveUser({ uid });
            if (mounted && fetchedUser) {
                setUser(fetchedUser);
            }
        }

        fetchUser();

        return () => {
            mounted = false;
        };
    }, []);

    return user;
}
