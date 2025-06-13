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
