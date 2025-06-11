export const mapCurrencyToDomain: Record<string, string> = {
    // North America
    "USD": ".com",       // United States
    "CAD": ".ca",        // Canada
    "MXN": ".com.mx",    // Mexico

    // South America
    "BRL": ".com.br",    // Brazil
    "ARS": ".com.ar",    // Argentina
    "CLP": ".cl",        // Chile
    "COP": ".com.co",    // Colombia
    "PEN": ".pe",        // Peru

    // Europe (Eurozone defaults to .fr)
    "EUR": ".fr",        // France, Germany, Italy, etc.
    "GBP": ".co.uk",     // United Kingdom
    "CHF": ".ch",        // Switzerland
    "DKK": ".dk",        // Denmark
    "SEK": ".se",        // Sweden
    "NOK": ".no",        // Norway
    "PLN": ".pl",        // Poland
    "CZK": ".cz",        // Czech Republic
    "HUF": ".hu",        // Hungary
    "RON": ".ro",        // Romania
    "HRK": ".hr",        // Croatia (now EUR, kept for legacy)
    "BGN": ".bg",        // Bulgaria

    // Asia
    "CNY": ".cn",        // China
    "HKD": ".com.hk",    // Hong Kong
    "TWD": ".com.tw",    // Taiwan
    "JPY": ".co.jp",     // Japan
    "KRW": ".co.kr",     // South Korea
    "INR": ".co.in",     // India
    "IDR": ".co.id",     // Indonesia
    "THB": ".co.th",     // Thailand
    "SGD": ".com.sg",    // Singapore
    "MYR": ".com.my",    // Malaysia
    "VND": ".com.vn",    // Vietnam
    "PHP": ".com.ph",    // Philippines

    // Middle East
    "ILS": ".co.il",     // Israel
    "AED": ".ae",        // United Arab Emirates
    "SAR": ".sa",        // Saudi Arabia
    "QAR": ".qa",        // Qatar
    "KWD": ".com.kw",    // Kuwait

    // Africa
    "ZAR": ".co.za",     // South Africa
    "NGN": ".com.ng",    // Nigeria
    "EGP": ".com.eg",    // Egypt
    "KES": ".co.ke",     // Kenya
    "MAD": ".ma",        // Morocco

    // Oceania
    "AUD": ".com.au",    // Australia
    "NZD": ".co.nz",     // New Zealand

    // Generic fallback
    "XOF": ".fr",        // West African CFA Franc (used in many French-speaking African countries)
    "XAF": ".fr",        // Central African CFA Franc
    "XCD": ".com",       // East Caribbean Dollar
    "BBD": ".com",       // Barbados Dollar
    "JMD": ".com.jm",    // Jamaica
    "TTD": ".com.tt",    // Trinidad and Tobago
};

export function getDomainByCurrency(currency: string): string {
    return mapCurrencyToDomain[currency] ?? mapCurrencyToDomain["USD"];
}