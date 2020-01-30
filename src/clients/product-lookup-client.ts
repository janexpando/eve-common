import { Injectable } from 'injection-js';
import { ObjectId } from 'bson';
import { Environment } from '../bootstrapping/environment';
import { EveClient } from './eve-client';
import { AmazonType } from '..';

export interface ApiLookupProduct {
    image: string;
    title: string;
    asin: string;
    url: string;
    group: string;
    price: number;
    currency: string;
    color: string;
    size: string;
    categoryId: string;
    rank: string;
}

export interface ApiLookupResult {
    quotaRemaining?: number;
    quotaMax?: number;
    quotaResetIn?: string;
    error: string;
    products: ApiLookupProduct[];
}

@Injectable()
export class ProductLookupClient extends EveClient {
    constructor(protected env: Environment) {
        super(env);
        this.baseUrl = this.env.PRODUCT_SERVICE_URL;
    }

    async lookup(companyId: ObjectId, marketplace: AmazonType, query: string): Promise<ApiLookupResult> {
        const url = `/company/${companyId}/marketplace/${marketplace}/product-lookup`;
        let response = await this.got.post(url, { body: { query } });
        return response.body;
    }
}
