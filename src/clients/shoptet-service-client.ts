import { Injectable } from 'injection-js';
import { EveClient } from './eve-client';
import { ObjectId } from 'bson';
import {
    ApiCarrierName,
    Environment,
    MARKETPLACE_TYPES,
    MarketplaceName,
    MARKETPLACES,
    MarketplaceType,
    Order,
    SERVICE_NAMES,
    ServiceName,
} from '..';
import { array, bool, object, string } from 'joi';

@Injectable()
export class ShoptetServiceClient extends EveClient {
    constructor(env: Environment) {
        super(env);
        this.baseUrl = env.SHOPTET_SERVICE_URL;
    }

    async postOrders(companyId: ObjectId, orders: Order[], settings: ShoptetOrdersImportSettings) {
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

    async syncShoptetOrders(companyId: ObjectId, importSettings: ShoptetOrdersImportSettings[]) {
        let response = await this.got.post(`/company/${companyId}/shoptet-order-sync`, {
            body: {
                importSettings,
            },
        });
        return response.body;
    }

    async getApiAccessToken(companyId: ObjectId): Promise<ApiShoptetAccessToken> {
        let response = await this.got.post(`/company/${companyId}/api-access-token`, {
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
}

export interface ApiShoptetAccessToken {
    companyId: ObjectId;
    accessToken: string;
    expiresAt: Date;
    lastUsedAt: Date;
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

export interface ApiAddress {
    name: string;
    email: string;
    addressLine: string[];
    city: string;
    country: string;
    district: string;
    stateOrRegion: string;
    zipCode: string;
    countryCode: string;
    phone: string;
    taxId: string;
    taxCountry: string;
}

export interface ApiInvoice {
    id: string;
    url: string;
}

export interface IAutopricing {
    sku: string;
    delta: number;
    base: number;
    autoprice?: number;
    date?: Date;
}

export const AUTOPRICING_STATUSES = ['None', 'Pending', 'Done'];

interface ApiDeliveryMethodsMapping {
    marketplace: MarketplaceName;
    method: string;
    serviceMethod: string;
}

export interface ShoptetOrdersImportSettings {
    companyId: ObjectId;
    marketplaceType: MarketplaceType;
    service: ServiceName;
    defaultOrderStatus?: string;
    importOrderJustOnce?: boolean;
    lowerStockOnOrder?: boolean;
    synchronizeOrders?: boolean;
    shipmentMethod?: string;
    synchronizeFbaOrders?: boolean;
    carrier?: ApiCarrierName;
    carrierName?: string;
    deliveryMethodsMapping?: ApiDeliveryMethodsMapping[];
    autoconfirmOrderOnStatus?: string;
}

export const optionalString = () =>
    string()
        .allow(null, '')
        .optional();
const optionalBool = () =>
    bool()
        .allow(null)
        .optional();

export const IMPORT_SETTINGS_JOI_SCHEMA = object({
    companyId: string().required(),
    marketplaceType: string().allow(MARKETPLACE_TYPES),
    service: string().allow(SERVICE_NAMES),
    defaultOrderStatus: optionalString(),
    importOrderJustOnce: optionalBool(),
    lowerStockOnOrder: optionalBool(),
    synchronizeOrders: optionalBool(),
    shipmentMethod: optionalString(),
    synchronizeFbaOrders: optionalBool(),
    carrier: optionalString(),
    carrierName: optionalString(),
    deliveryMethodsMapping: array()
        .items(
            object({
                marketplace: string().allow(MARKETPLACES),
                method: string(),
                serviceMethod: string(),
            }),
        )
        .allow(null),
    autoconfirmOrderOnStatus: optionalString(),
});
