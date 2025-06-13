export const CACHE_PREFIX = 'user_cache_';


export const mapAccountToAccountName: Record<string, string> = {
    "ebay": "eBay",
    "stockx": "StockX"
}


export const MARKET_ITEM_CACHE_PREFIX = '@marketItem:';


// Free
export const FREE_MAX_AUTOMATIC_LISTINGS = 12;
export const FREE_MAX_MANUAL_LISTINGS = 12;
export const FREE_ONE_TIME_EXPENSES = 12;
export const FREE_SUBSCRIPTION_EXPENSES = 3;

// Standard
export const STANDARD_MAX_AUTOMATIC_LISTINGS = 48;
export const STANDARD_SUBSCRIPTION_EXPENSES = 6;
export const STANDARD_UPLOAD_LIMIT = 100;

// Pro
export const PRO_MAX_AUTOMATIC_LISTINGS = 96;
export const PRO_UPLOAD_LIMIT = 200;

export const subscriptionLimits = {
    "free": {
        "automatic": FREE_MAX_AUTOMATIC_LISTINGS,
        "manual": FREE_MAX_MANUAL_LISTINGS,
        "oneTimeExpenses": FREE_ONE_TIME_EXPENSES,
        "subscriptionExpenses": FREE_SUBSCRIPTION_EXPENSES,
        "upload-limit": 0
    },
    "standard": {
        "automatic": STANDARD_MAX_AUTOMATIC_LISTINGS,
        "subscriptionExpenses": STANDARD_SUBSCRIPTION_EXPENSES,
        "upload-limit": STANDARD_UPLOAD_LIMIT
    },
    "pro": {
        "automatic": PRO_MAX_AUTOMATIC_LISTINGS,
        "upload-limit": PRO_UPLOAD_LIMIT
    },
    "enterprise 1": {
        "automatic": 200,
        "upload-limit": 300

    },
    "enterprise 2": {
        "automatic": 500,
        "upload-limit": 400
    },
    "enterprise 3": {
        "automatic": 750,
        "upload-limit": 500
    },
    "enterprise 4": {
        "automatic": 1000,
        "upload-limit": 600
    },
}