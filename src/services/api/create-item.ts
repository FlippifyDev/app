export async function createItem({ idToken, item }: { idToken: string, item: any }) {
    try {
        const res = await fetch('https://flippify.io/api/add-item', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
        });

        const data = await res.json();
        return { success: res.ok, error: data.error || null };
    } catch (err) {
        return { success: false, error: `${err}` || 'Unknown error' };
    }
}