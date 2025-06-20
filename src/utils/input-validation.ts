export function validateUrlInput(
    url: string,
    setFunction: (value: string) => void,
    setValidUrl?: (value: boolean) => void,
    maxLength: number = 2048
): void {
    // Check if the input exceeds the maximum length.
    if (url.length > maxLength) {
        return;
    }

    const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-._~:/?#[\]@!$&'()*+,;=]*)?$/i;
    const isValidUrl = urlPattern.test(url);
    setFunction(url);
    if (isValidUrl) {
        if (setValidUrl) setValidUrl(true);
    } else {
        if (setValidUrl) setValidUrl(false);

    }
};


export const validatePriceInput = (
    value: string,
    setFunction: (value: string) => void,
    maxLength: number = 12
): void => {
    // Check if the input exceeds the maximum length.
    if (value.length > maxLength) {
        return;
    }

    // Regex to allow only numbers and at most one "."
    const validPriceRegex = /^\d*(\.\d{0,2})?$/;
    if (validPriceRegex.test(value)) {
        setFunction(value);
    }
};