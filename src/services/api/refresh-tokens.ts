export async function refreshTokens({ idToken }: { idToken: string }) {
    try {
        const res = await fetch('https://flippify.io/api/refresh-token', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            },
        });

        const data = await res.json();
        return { success: res.ok, error: data.error || null };
    } catch (err) {
        return { success: false, error: `${err}` || 'Unknown error' };
    }
}