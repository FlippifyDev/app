import { ISubscription, IUser } from "../models/user";

export function extractUserSubscription(subscriptions: ISubscription[]): ISubscription | void {
    return subscriptions.find(sub => sub.name?.includes('member'));
}


export function extractUserListingsCount(user?: IUser): number {
    if (!user || !user.store?.numListings) {
        return 0;
    }

    const numListings = user.store.numListings;

    const automaticCount = numListings.automatic ?? 0;
    const manualCount = numListings.manual ?? 0;

    return automaticCount + manualCount;
}
