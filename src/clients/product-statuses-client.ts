import {Injectable} from 'injection-js';
import {ObjectId} from 'bson';
import {Environment} from "../bootstrapping/environment";
import {EveClient} from "./eve-client";
import {MarketplaceName} from "..";

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


@Injectable()
export class ProductStatusesClient extends EveClient {
    constructor(protected env: Environment) {
        super(env);
        this.baseUrl = this.env.PRODUCT_SERVICE_URL;
    }

    async get(companyId: ObjectId, marketplace: MarketplaceName, sku: string): Promise<ApiProductStatuses> {
        const url = `/company/${companyId}/marketplace/${marketplace}/sku/${encodeURIComponent(sku)}/product-statuses`;
        let response = await this.got.get(url);
        return response.body;
    }
}
