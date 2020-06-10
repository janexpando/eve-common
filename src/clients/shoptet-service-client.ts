import { Injectable } from 'injection-js';
import { EveClient } from './eve-client';
import { ObjectId } from 'bson';
import { Environment, ApiOrder, CurrencyCode } from '..';
import { ApiImportSettings } from '../settings/import-settings-model';

@Injectable()
export class ShoptetServiceClient extends EveClient {
    constructor(env: Environment) {
        super(env);
        this.baseUrl = env.SHOPTET_SERVICE_URL;
    }

    async postOrders(companyId: ObjectId, orders: ApiOrder[], settings: ApiImportSettings) {
        return this.got.post(`/company/${companyId}/orders`, {
            body: {
                orders,
                settings,
            },
        });
    }

    async getShoptetShipmentMethods(companyId: ObjectId): Promise<IShoptetShipmentMethod[]> {
        let response = await this.got.get(`/company/${companyId}/shoptet-shipment-methods`);
        return response.body;
    }

    async getShoptetOrderStatuses(companyId: ObjectId): Promise<IShoptetOrderStatus[]> {
        let response = await this.got.get(`/company/${companyId}/shoptet-order-statuses`);
        return response.body;
    }

    async syncShoptetOrders(companyId: ObjectId, importSettings: ApiImportSettings[]) {
        let response = await this.got.post(`/company/${companyId}/shoptet-order-sync`, {
            body: {
                importSettings,
            },
        });
        return response.body;
    }

    async getApiAccessToken(companyId: ObjectId, addon?: string): Promise<ApiShoptetAccessToken> {
        const url = addon
            ? `/company/${companyId}/api-access-token/${addon}`
            : `/company/${companyId}/api-access-token`;

        let response = await this.got.post(url, {
            body: {},
        });
        let token: ApiShoptetAccessToken = response.body.token;
        if (token) {
            token.companyId = new ObjectId(token.companyId);
            token.expiresAt = new Date(token.expiresAt);
            token.lastUsedAt = new Date(token.lastUsedAt);
        }
        return token;
    }

    async getShopInfo(companyId: ObjectId): Promise<ApiShop> {
        const url = `/company/${companyId}/shop-info`;

        const response = await this.got.get(url);
        return response.body;
    }

    async getShoptetPaymentMethods(companyId: ObjectId): Promise<ApiShoptetPaymentMethod[]> {
        let response = await this.got.get(`/company/${companyId}/shoptet-payment-methods`);
        return response.body;
    }
}

export enum Addon {
    Amazon = 'amazon',
    Alza = 'alza',
    Mall = 'mall',
}

export interface ApiShopAddon {
    oAuthToken: string;
    active: boolean;
}

export interface ApiShop {
    companyId: ObjectId;
    addons: {
        [key in Addon]?: ApiShopAddon;
    };
    shopId: number;
    hostname: string;
    urls: Record<string, string>;
    currencies: CurrencyCode[];
}

export interface ApiShoptetAccessToken {
    companyId: ObjectId;
    accessToken: string;
    expiresAt: Date;
    lastUsedAt: Date;
    addon: string;
}

export interface ApiShoptetPaymentMethod {
    guid: string;
    name: string;
    description: string;
    paymentType: {
        id: number;
        code: string;
        name: string;
    };
    visible: boolean;
    priority: number;
    wholesale: boolean;
    logoUrl: string;
    eetEligible: boolean;
}

export interface IShoptetOrderStatus {
    code: number;
    order: number;
    name: string;
    markAsPaid: boolean;
}

export interface IShoptetShipmentMethod {
    guid: string;
    order: number;
    name: string;
    visible: boolean;
}
