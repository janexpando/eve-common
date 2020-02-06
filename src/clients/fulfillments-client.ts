import { ObjectId } from 'bson';
import { Injectable } from 'injection-js';
import { MarketplaceName } from '../models/marketplace-names';
import { Environment } from '../bootstrapping/environment';
import { EveClient } from './eve-client';
import { ApiCarrierName } from './settings-client';

export type ApiFulfillmentStatus = 'Registered' | 'Shipped' | 'AtDepot' | 'Delivered' | 'Canceled' | 'Failed';

export interface ApiFulfillment {
    companyId: ObjectId;
    marketplaceOrderId: string;
    marketplace: MarketplaceName;
    status: ApiFulfillmentStatus;
    carrier?: ApiCarrierName;
    shipDate?: Date;
    trackingNumber?: string;
    carrierName?: string;
    shipMethod?: string;
    trackingUrl?: string;
}

@Injectable()
export class FulfillmentsClient extends EveClient {
    constructor(protected env: Environment) {
        super(env);
        this.baseUrl = this.env.GATEWAY_URL;
    }

    async updateFulfillments(companyId: ObjectId, fulfillments: ApiFulfillment[]) {
        let body: any = {
            fulfillments,
        };

        await this.got.post(`/company/${companyId}/fulfillments`, {
            body,
        });
    }
}
