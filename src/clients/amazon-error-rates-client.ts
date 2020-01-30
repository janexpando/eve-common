import { Injectable } from 'injection-js';
import { ObjectId } from 'bson';
import { Environment } from '../bootstrapping/environment';
import { EveClient } from './eve-client';
import { MarketplaceName } from '..';

export interface ApiAmazonErrorRates {
    companyId: ObjectId;
    code: string;
    marketplace: MarketplaceName;
    message: string;
    count: number;
}

@Injectable()
export class AmazonErrorRatesClient extends EveClient {
    constructor(protected env: Environment) {
        super(env);
        this.baseUrl = this.env.PRODUCT_SERVICE_URL;
    }

    async getTopTen(companyId: ObjectId, marketplace: MarketplaceName): Promise<ApiAmazonErrorRates[]> {
        const url = `/company/${companyId}/marketplace/${marketplace}/error-rates`;
        let response = await this.got.get(url);
        return response.body;
    }
}
