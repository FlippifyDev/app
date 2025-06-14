// Local Imports
import { DateFilterKeyType, ItemType } from "@/src/services/firebase/models";
import { IListing, IOrder } from "@/src/models/store-data";

// External Imports
import { isAfter, isBefore, isEqual, parseISO } from "date-fns";
import { extractItemDateByFilter } from "@/src/services/firebase/extract";


export function filterItemsByDate({ items, filterKey, timeFrom, timeTo }: { items: ItemType[], filterKey: DateFilterKeyType, timeFrom: string, timeTo?: string }) {
    const fromDate = new Date(timeFrom);
    const toDate = timeTo ? new Date(timeTo) : null;

    return items.filter((item) => {
        const dateStr = extractItemDateByFilter({ item, filterKey });
        if (!dateStr) return false;

        const itemDate = new Date(dateStr);
        if (isNaN(itemDate.getTime())) return false;

        const isAfterFrom = itemDate >= fromDate;
        const isBeforeTo = toDate ? itemDate <= toDate : true;

        return isAfterFrom && isBeforeTo;
    });
}

// Function to filter orders by the given time range
export const filterOrdersByDateRange = (orders: IOrder[], timeFrom: string, timeTo: string) => {
    const timeFromDate = new Date(timeFrom);
    const timeToDate = new Date(timeTo);

    return orders.filter(order => {
        if (!order) return;
        const listingDate = new Date(order.listingDate ?? "");
        const saleDate = new Date(order.sale?.date ?? "");

        // Check if listingDate or saleDate is within the given time range
        return (listingDate >= timeFromDate && listingDate <= timeToDate) ||
            (saleDate >= timeFromDate && saleDate <= timeToDate);
    });
};

/**
 * Filters orders based on the provided time range.
 * 
 * @param {IOrder[]} orders - The array of orders to be filtered.
 * @param {string} timeFrom - Start date in ISO format (e.g., "2025-02-28").
 * @param {string} [timeTo] - End date in ISO format, or defaults to the current date.
 * @returns {IOrder[]} - Filtered orders matching the date range.
 */
export function filterOrdersByTime(
    orders: IOrder[],
    timeFrom: string,
    timeTo?: string
): IOrder[] {
    // Parse start and end dates and convert them to UTC to avoid timezone mismatch
    const startDate = parseISO(timeFrom);
    const endDate = timeTo ? parseISO(timeTo) : new Date();

    // Force endDate to be in UTC by using Date.UTC()
    const endDateUTC = new Date(Date.UTC(
        endDate.getUTCFullYear(),
        endDate.getUTCMonth(),
        endDate.getUTCDate(),
        endDate.getUTCHours(),
        endDate.getUTCMinutes(),
        endDate.getUTCSeconds()
    ));

    return orders.filter((order) => {
        // Parse order date and force UTC
        const orderDate = parseISO(order.sale?.date ?? "");

        // Ensure valid date parsing
        if (isNaN(orderDate.getTime())) {
            console.warn(`Invalid order date format for order: ${order.orderId}`);
            return false;
        }

        // Force orderDate to UTC for comparison consistency
        const orderDateUTC = new Date(Date.UTC(
            orderDate.getUTCFullYear(),
            orderDate.getUTCMonth(),
            orderDate.getUTCDate(),
            orderDate.getUTCHours(),
            orderDate.getUTCMinutes(),
            orderDate.getUTCSeconds()
        ));

        return (
            (isEqual(orderDateUTC, startDate) || isAfter(orderDateUTC, startDate)) &&
            (isEqual(orderDateUTC, endDateUTC) || isBefore(orderDateUTC, endDateUTC))
        );
    });
}

export function filterInventoryByTime(
    inventory: IListing[],
    timeFrom: string,
    timeTo?: string
): IListing[] {
    const timeFromDate = new Date(timeFrom).getTime();
    const timeToDate = timeTo ? new Date(timeTo).getTime() : Date.now(); // Use current date if no timeTo

    return inventory.filter((item) => {
        const itemTimestamp = new Date(item.dateListed ?? "").getTime();
        return itemTimestamp >= timeFromDate && itemTimestamp <= timeToDate;
    });
}