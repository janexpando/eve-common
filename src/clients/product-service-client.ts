import {Injectable} from 'injection-js';
import {ObjectId} from 'bson';
import {EveClient} from "./eve-client";
import {Environment} from "../bootstrapping/environment";
import {AmazonType, MarketplaceName} from "../models/marketplace-names";
import {Dict} from "../types";
import {ApiBarcode} from "../products/parse-barcode";
import {IMwsCredentials} from "./product-pricing-client";

export type Status =
    | "ok"
    | "paused"
    | "notFound"
    | "error"
    | "missingBarcode";

@Injectable()
export class ProductServiceClient extends EveClient {
    constructor(protected env: Environment) {
        super(env);
        this.baseUrl = this.env.PRODUCT_SERVICE_URL;
    }

    async getPage(
        companyId: ObjectId,
        marketplace: MarketplaceName,
        search: string,
        sort: any[],
        skip: number,
        perPage: number,
        buyBox?: boolean,
        isBuyBoxWinner?: boolean,
        status?: Status
    ) {
        let response = await this.got.post(
            `/company/${companyId}/products/page`,
            {
                body: {
                    marketplace,
                    search,
                    sort,
                    skip,
                    perPage,
                    buyBox,
                    isBuyBoxWinner,
                    status
                },
            },
        );

        return response.body;
    }

    async getCount(
        companyId: ObjectId,
        marketplace: MarketplaceName,
        search: string,
        buyBox?: boolean,
        isBuyBoxWinner?: boolean,
        status?: Status
    ) {
        let response = await this.got.post(
            `/company/${companyId}/products/count`,
            {
                body: {
                    marketplace,
                    search,
                    buyBox,
                    isBuyBoxWinner,
                    status
                },
            },
        );

        return response.body;
    }

    async frontendUpdateProductVariant(companyId: ObjectId, variant: ApiVariant) {
        let response = await this.got.patch(
            `/company/${companyId}/products/variants/${encodeURIComponent(
                variant.sku,
            )}`,
            {
                body: variant,
            },
        );

        return response.body;
    }

    async getProductsFromLastUpdated(companyId: ObjectId, lastUpdated: Date) {
        let response = await this.got.get(`/company/${companyId}/products/fromLastUpdated/${lastUpdated.toISOString()}`);
        return response.body;
    }

    async requestShallowPricingReport(companyId: ObjectId, marketplace: MarketplaceName, credentials: IMwsCredentials) {
        let response = await this.got.post(
            `/company/${companyId}/marketplace/${marketplace}/shallow-pricing-report`,
            {
                body: {
                    credentials
                }
            },
        );

        return response.body;
    }
}

export interface ApiPrice {
    base: number;
    currencyBase: string;
    selling?: number;
    min?: number;
    max?: number;
}

export interface ApiAsins extends Dict<string, AmazonType> {

}

export interface ApiVariant {
    companyId: ObjectId;
    sku: string;
    barcode: ApiBarcode;
    image?: string;
    name: string;
    stock: number;
    prices: Dict<ApiPrice, MarketplaceName>;
    removedAt?: Date;
    asins: ApiAsins;
    shippingTemplate?: string;
    locks?: string[];
    /**
     * Parent product info
     */
    parent?: string;
}
