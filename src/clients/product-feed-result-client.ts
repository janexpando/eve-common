import { Injectable } from 'injection-js';
import { ObjectId } from 'bson';
import { Environment } from '../bootstrapping/environment';
import { EveClient } from './eve-client';

export type ProductFeedType = 'GOOGLE_PRODUCT' | 'SHOPIFY' | 'SHOPTET' | 'NONE' | 'CUSTOM';

export const PRODUCT_FEED_TYPE: ProductFeedType[] = ['GOOGLE_PRODUCT', 'SHOPIFY', 'SHOPTET', 'NONE', 'CUSTOM'];

export interface ApiProductFeedResult {
    companyId: ObjectId;
    productsInStock: number;
    productsWithEAN: number;
    productsAll: number;
    productsToBeListed: number;
    feedUrl: string;
    feedType: ProductFeedType;
    currency: string;
    error: string | null;
}

@Injectable()
export class ProductFeedResultClient extends EveClient {
    constructor(protected env: Environment) {
        super(env);
        this.baseUrl = this.env.PRODUCT_SERVICE_URL;
    }

    async get(companyId: ObjectId): Promise<ApiProductFeedResult> {
        const url = `/company/${companyId}/product-feed-result`;
        let response = await this.got.get(url);
        return response.body;
    }
}
