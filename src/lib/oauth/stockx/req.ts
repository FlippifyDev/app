export async function request_search({ accessToken, query }: { accessToken: string, query: string }): Promise<{ data?: any, error?: any }> {
    const api_key = process.env.EXPO_PUBLIC_STOCKX_API_KEY;

    if (!api_key || !accessToken) return { error: "Tokens not available" };

    const queryParams = new URLSearchParams({
        query: query,
        pageNumber: '1',
        pageSize: '30'
    }).toString();

    const resp = await fetch(
        `https://api.stockx.com/v2/catalog/search?${queryParams}`,
        {
            method: 'GET',
            headers: {
                'x-api-key': api_key,
                Authorization: `Bearer ${accessToken}`
            }
        }
    );

    const data = await resp.text()
    return { data };
}


export async function request_product({ accessToken, productId, currency }: { accessToken: string, productId: string, currency?: string }): Promise<{ data?: any, error?: any }> {
    const api_key = process.env.EXPO_PUBLIC_STOCKX_API_KEY;

    if (!api_key || !accessToken) return { error: "Tokens not available" };



    const resp = await fetch(
        `https://api.stockx.com/v2/catalog/products/${productId}/market-data`,
        {
            method: 'GET',
            headers: {
                'x-api-key': api_key,
                Authorization: `Bearer ${accessToken}`
            }
        }
    );
    console.log(resp)

    const data = await resp.text()
    return { data };
}
