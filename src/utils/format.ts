export function formatDateToISO(date: Date, useCurrentTime?: boolean): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    let hours: string, minutes: string, seconds: string, milliseconds: string;

    if (useCurrentTime) {
        const now = new Date();
        hours = String(now.getHours()).padStart(2, "0");
        minutes = String(now.getMinutes()).padStart(2, "0");
        seconds = String(now.getSeconds()).padStart(2, "0");
        milliseconds = String(now.getMilliseconds()).padStart(3, "0");
    } else {
        hours = String(date.getHours()).padStart(2, "0");
        minutes = String(date.getMinutes()).padStart(2, "0");
        seconds = String(date.getSeconds()).padStart(2, "0");
        milliseconds = String(date.getMilliseconds()).padStart(3, "0");
    }
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
}


export const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    };
    return date.toLocaleDateString("en-GB", options);
};


export function shortenText(name: string, length: number = 20): string {
    if (name.length <= length) {
        return name;
    }

    if (name.length <= 2 * length) {
        // For names between length and 2*length, split into two halves (minus 3 for the ellipsis)
        const half = Math.floor((name.length - 3) / 2);
        return `${name.substring(0, half)}...${name.substring(name.length - half)}`;
    }

    // For longer names, use the full cutoff at both ends.
    return `${name.substring(0, length)}...${name.substring(name.length - length)}`;
}


export function formatUsername(username: string): string {
    // Split the username into words by uppercase letters
    const words = username.match(/[A-Z][a-z]*/g);

    if (!words) {
        // If no match (e.g., username is all lowercase), return first two letters
        return username.slice(0, 2).toUpperCase();
    }

    if (words.length === 1) {
        // Only one word - return first two letters
        return words[0].slice(0, 2).toUpperCase();
    }

    // Multiple words - return first letter of first two words
    return (words[0][0] + words[1][0]).toUpperCase();
}