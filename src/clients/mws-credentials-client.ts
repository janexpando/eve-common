import { EveClient } from './eve-client';
import { ObjectId } from 'bson';
import { Environment } from '../bootstrapping/environment';
import { AmazonType } from '../models/marketplace-names';
import { Injectable } from 'injection-js';

@Injectable()
export class MwsCredentialsClient extends EveClient {
    constructor(protected env: Environment) {
        super(env);
        this.baseUrl = this.env.COMPANY_SERVICE_URL;
    }

    async getCredentials(companyId: ObjectId, marketplace: AmazonType): Promise<ApiMwsCredentials> {
        let result = await this.got.get(`/company/${companyId}/marketplace/${marketplace}/mws-credentials`);
        return result.body;
    }
}

interface ApiMwsCredentials {
    developerId: string;
    token: string;
    sellerId: string;
    marketplaceId: string;
}
