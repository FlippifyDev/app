export async function request({ url }: { url: string }) {
    try {
        const res = await fetch(url, {
            headers: {
                'Referer': 'https://flippify.io',
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            },
        });

        return await res.text();

    } catch (error) {
        console.error('Proxy error:', error);
        return { error: `${error}` };
    }
}