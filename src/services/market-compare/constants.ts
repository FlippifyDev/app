// Local Imports
import { scrapeSold as ebayScrapeSold, scrapeListed as ebayScrapeListed } from "./ebay";
import { scrapeListed as stockxScrapeListed } from "./stockx";

export const fetchFunctions: Record<
    string,
    (args: { uid?: string, query: string }) => Promise<{ item?: any, error?: string }>
> = {
    //ebayListed: ebayScrapeListed,
    //ebaySold: ebayScrapeSold,
    stockxListed: stockxScrapeListed 
};