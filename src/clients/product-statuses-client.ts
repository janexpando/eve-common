import {Injectable} from 'injection-js';
import {ObjectId} from 'bson';
import {Environment} from "../bootstrapping/environment";
import {EveClient} from "./eve-client";
import {AmazonType, ApiProductStats, MarketplaceName} from "..";

export type ListingStatusKind = "ok" | "error";

export type ProductStatusKind =
    | "ok"
    | "paused"
    | "notFound"
    | "error"
    | "missingBarcode";

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


export interface ApiProductStatuses {
    companyId: ObjectId;
    marketplace: MarketplaceName;
    sku: string;
    hasAsin: boolean;
    hasStock: boolean;
    hasValidBarcode: boolean;
    isBuyBoxWinner: boolean;
    listingStatus: ListingStatusKind;
    listingErrors: ApiListingError[];
    status: ProductStatusKind;
    forbidListing?: boolean;
}

export interface ApiProductStats {
    companyId: ObjectId;
    marketplace: AmazonType | AmazonType[];
    ok: number;
    paused: number;
    notFound: number;
    error: number;
    missingBarcode: number;
}

@Injectable()
export class ProductStatusesClient extends EveClient {
    constructor(protected env: Environment) {
        super(env);
        this.baseUrl = this.env.PRODUCT_SERVICE_URL;
    }

    async getListingStatus(companyId: ObjectId, sku: string): Promise<ApiListingStatus[]> {
        const url = `/company/${companyId}/listing-status/${encodeURIComponent(sku)}`;
        let response = await this.got.get(url);
        return response.body;
    }

    async getForbidListings(companyId: ObjectId, sku: string) {
        const url = `/company/${companyId}/blacklist/${encodeURIComponent(sku)}`;
        let response = await this.got.get(url);
        return response.body;
    }

    async getProductStatuses(companyId: ObjectId, marketplace: MarketplaceName, sku: string): Promise<ApiProductStatuses> {
        const url = `/company/${companyId}/marketplace/${marketplace}/sku/${encodeURIComponent(sku)}/product-statuses`;
        let response = await this.got.get(url);
        return response.body;
    }

    async getProductStats(companyId: ObjectId, marketplace: MarketplaceName | MarketplaceName[]): Promise<ApiProductStats> {
        const url = `/company/${companyId}/product-stats`;
        let response = await this.got.post(url, {
            body: { marketplace }
        });
        return response.body;
    }
}
