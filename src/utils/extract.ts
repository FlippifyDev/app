import { ISubscription } from "../models/user";

export function extractUserSubscription(subscriptions: ISubscription[]): ISubscription | void {
    return subscriptions.find(sub => sub.name?.includes('member'));
}
