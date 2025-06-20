export async function retrieveStoreTypes({ idToken, subColFilter }: { idToken: string, subColFilter: string }) {
    try {
        const url = `https://flippify.io/api/retrieve-storetypes?subColFilter=${encodeURIComponent(subColFilter)}`
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            },
        });

        const data = await res.json();
        return { success: res.ok, storeTypes: data.storeTypes, error: data.error || null };
    } catch (err) {
        return { success: false, error: `${err}` || 'Unknown error' };
    }
}