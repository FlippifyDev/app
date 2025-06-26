// Local Imports
import Home from '@/src/components/home/index/Home';
import NoAccess from '@/src/components/home/index/NoAccess';
import { useUser } from '@/src/hooks/useUser';
import { useGlobalSearchParams } from 'expo-router';

// External Imports
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';


export default function HomeScreen() {
    const { login } = useGlobalSearchParams();
    const [refresh, setRefresh] = useState<boolean>(false);
    const user = useUser({ refresh: refresh })

    useEffect(() => {
        if (typeof login === 'string') {
            try {
                const parsed = JSON.parse(login);

                setRefresh(!(!parsed));
            } catch (err) {
                console.error('Invalid listing JSON:', err);
            }
        }
    }, [login]);

    if (user && !user?.authentication?.subscribed || user?.authentication?.subscribed === "free") {
        return <NoAccess />;
    } else if (!user) {
        return <ActivityIndicator size="small" />
    }

    return (
        <Home />
    );
}