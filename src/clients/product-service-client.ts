import {Injectable} from 'injection-js';
import {ObjectId} from 'bson';
import {AmazonType, Dict, Environment, EveClient, ApiBarcode, MarketplaceName} from "..";

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
                },
            },
        );

        return response.body;
    }

    async getCount(
        companyId: ObjectId,
        marketplace: MarketplaceName,
        search: string,
    ) {
        let response = await this.got.post(
            `/company/${companyId}/products/count`,
            {
                body: {
                    marketplace,
                    search,
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
