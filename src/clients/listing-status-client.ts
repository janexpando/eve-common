import {Injectable} from 'injection-js';
import {ObjectId} from 'bson';
import {Environment} from "../bootstrapping/environment";
import {EveClient} from "./eve-client";
import {MarketplaceName} from "..";

export type ListingStatusKind = "ok" | "error";

export interface ApiListingError {
    code: string;
    message: string;
}

export interface ApiListingStatus {
    companyId: ObjectId;
    marketplace: MarketplaceName;
    sku: string;
    listingStatus: ListingStatusKind;
    listingErrors: ApiListingError[];
}

@Injectable()
export class ListingStatusClient extends EveClient {
    constructor(protected env: Environment) {
        super(env);
        this.baseUrl = this.env.PRODUCT_SERVICE_URL;
    }

    async get(companyId: ObjectId, sku: string): Promise<ApiListingStatus[]> {
        const url = `/company/${companyId}/listing-status/${encodeURIComponent(sku)}`;
        let response = await this.got.get(url);
        return response.body;
    }
}
