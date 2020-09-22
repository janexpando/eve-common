import { ObjectId } from 'bson';
import { Injectable } from 'injection-js';
import { MarketplaceName } from '../models/marketplace-names';
import { Environment } from '../bootstrapping/environment';
import { EveClient } from './eve-client';
import { ApiCarrierName } from './settings-client';

export type ApiFulfillmentStatus =
    | 'Registered'
    | 'Shipped'
    | 'AtDepot'
    | 'Delivered'
    | 'Canceled'
    | 'Failed'
    | 'OutForDelivery';

interface IMonetaryValue {
    value: number;
    currency: string;
}

interface IParcelShop {
    parcelShopIdentification: string;
    parcelShopBranchCode: string;
}

interface IPackageItem {
    marketplaceItemId: string;
    marketplaceOrderId: string;
    quantity: number;
}

export interface IPackage {
    number?: string;
    fullNumber?: string;
    weight: number;
    items: IPackageItem[];
}

export interface ApiFulfillment {
    _id?: string;
    companyId: ObjectId;
    marketplaceOrderIds: string[];
    fulfillmentId?: string;
    marketplace: MarketplaceName;
    status: ApiFulfillmentStatus;
    carrier?: ApiCarrierName;
    shipDate?: Date;
    trackingNumber?: string;
    carrierName?: string;
    shipMethod?: string;
    trackingUrl?: string;
    cashOnDelivery?: IMonetaryValue;
    shipmentValue?: IMonetaryValue;
    parcelShop?: IParcelShop;
    packages?: IPackage[];
    syncError?: string;
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

    async updateFulfillmentById(fulfillment: ApiFulfillment): Promise<ApiFulfillment> {
        if (!fulfillment._id) throw new Error('fulfillment._id is required');
        const response = await this.got.patch(`/fulfillments/${fulfillment._id}`, {
            body: fulfillment,
        });

        return response.body;
    }

    async getFulfillmentById(fulfillmentId: string): Promise<ApiFulfillment> {
        const response = await this.got.get(`/fulfillments/${fulfillmentId}`);
        return response.body;
    }

    async getFulfillment(
        companyId: ObjectId,
        marketplace: MarketplaceName,
        marketplaceOrderId: string,
    ): Promise<ApiFulfillment> {
        return (await this.got.get(`/company/${companyId}/fulfillments/${marketplace}/${marketplaceOrderId}`)).body;
    }

    async confirmFulfillment(
        companyId: ObjectId,
        marketplace: MarketplaceName,
        marketplaceOrderId: string,
        syncError?: string,
    ) {
        return this.got.patch(`/company/${companyId}/fulfillments/${marketplace}/${marketplaceOrderId}`, {
            body: {
                syncError: syncError || null,
            },
        });
    }
}
