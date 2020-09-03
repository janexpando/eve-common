import { EveClient } from './eve-client';
import { ApiOrderStatus, Environment } from '..';
import { Injectable } from 'injection-js';
import { ObjectId } from 'bson';
import { MallType } from '..';
import { ApiFulfillmentStatus } from './fulfillments-client';

export interface ApiMallFulfillment {
    companyId: ObjectId;
    marketplaceOrderId: string;
    marketplace: MallType;
    trackingNumber: string;
    trackingUrl: string;
    status?: ApiFulfillmentStatus; // make required
}

export interface ApiMallFulfillmentResponse {
    fulfilled: boolean;
    correctOrderStatus?: ApiOrderStatus;
}

@Injectable()
export class MallServiceClient extends EveClient {
    constructor(protected env: Environment) {
        super(env);
        this.baseUrl = this.env.MALL_SERVICE_URL;
    }

    async getDeliveryMethods(companyId: ObjectId): Promise<ApiMallDeliveryMethod[]> {
        let response = await this.got.get(`/company/${companyId}/mall-delivery-methods`);
        return response.body;
    }

    async fulfillOrder(companyId: ObjectId, fulfillment: ApiMallFulfillment): Promise<ApiMallFulfillmentResponse> {
        const response = await this.got.post(`/company/${companyId}/fulfillment`, {
            body: { fulfillment },
        });
        return response.body;
    }

    async getCredentials(
        companyId: ObjectId,
        marketplace: MallType,
    ): Promise<{ companyId: ObjectId; authorizationKey: string; webhookId: string }> {
        let response = await this.got.get(`/company/${companyId}/mall-credentials/${marketplace}`);
        return response.body;
    }

    async updateCredentials(
        companyId: ObjectId,
        marketplace: MallType,
        authorizationKey: string,
        active: boolean,
    ): Promise<ApiMallDeliveryMethod[]> {
        let response = await this.got.put(`/company/${companyId}/mall-credentials/${marketplace}`, {
            body: {
                authorizationKey,
                active,
            },
        });
        return response.body;
    }

    async getStatuses(companyId: ObjectId): Promise<{ marketplace: MallType; status: 'online' | 'offline' }[]> {
        let response = await this.got.get(`/company/${companyId}/statuses`);
        return response.body;
    }
}

export interface ApiMallDeliveryMethod {
    code: string;
    title: string;
    marketplace: MallType;
}
