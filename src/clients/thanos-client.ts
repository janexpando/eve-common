import { Injectable } from 'injection-js';
import { Environment } from '../bootstrapping/environment';
import { GotInstance, GotJSONFn } from 'got';
import got = require('got');
import { ObjectId } from 'bson';
import { handlePromises } from '../utils/handle-promises';

@Injectable()
export class ThanosClient {
    constructor(private env: Environment) {}

    private got(baseUrl): GotInstance<GotJSONFn> {
        let token = this.env.EVE_AUTH_BEARER;
        return got.extend({
            baseUrl,
            json: true,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    async snap(companyId: ObjectId): Promise<{ result: any; error: Error }[]> {
        return handlePromises([
            this.snapServiceCompany(this.env.PRODUCT_SERVICE_URL, companyId),
            this.snapServiceCompany(this.env.SHOPTET_SERVICE_URL, companyId),
            this.snapServiceCompany(this.env.MALL_SERVICE_URL, companyId),
            this.snapServiceCompany(this.env.ALZA_SERVICE_URL + '/v1', companyId),
            this.snapServiceCompany(this.env.GATEWAY_URL, companyId, true),
        ]);
    }

    private async snapServiceCompany(
        serviceUrl: string,
        companyId: ObjectId,
        isGateway: boolean = false,
    ): Promise<any> {
        const url = `/thanos/snap`;
        let response = await this.got(serviceUrl).post(url, { body: { companyId, isGateway } });
        return response.body;
    }
}
