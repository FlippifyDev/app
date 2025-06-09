// Local Imports
import { IMarketSoldItem, IMarketListedItem } from "@/src/models/market-compare";
import { scrapeSold as ebayScrapeSold, scrapeListed as ebayScrapeListed } from "./ebay";

export const fetchFunctions: Record<
    string,
    (args: { query: string }) => Promise<{ item?: IMarketListedItem | IMarketSoldItem, error?: string }>
> = {
    ebayListed: ebayScrapeListed,
    ebaySold: ebayScrapeSold,
    //stockxListed: stockxScrapeListed 
};