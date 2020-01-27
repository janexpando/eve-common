import {Injectable} from 'injection-js';
import {EveClient} from "./eve-client";
import {ObjectId} from "bson";
import {ApiCarrierName, Environment, MarketplaceType, ServiceName} from "..";
import {MarketplaceName, MARKETPLACES} from "..";
import {CURRENCY_CODES, CurrencyCode} from "..";
import {array, bool, date, number, object, string} from "joi";

@Injectable()
export class ShoptetServiceClient extends EveClient {
    constructor(env: Environment) {
        super(env);
        this.baseUrl = env.SHOPTET_SERVICE_URL;
    }

    async postOrders(companyId: ObjectId, orders: ApiOrder[], settings: ApiImportSettings) {
        return this.got.post(
            `/company/${companyId}/orders`,
            {
                body: {
                    orders,
                    settings
                },
            },
        );
    }

    async getShoptetShipmentMethods(companyId: ObjectId): Promise<IShoptetShipmentMethod[]> {
        let response = await this.got.get(
            `/company/${companyId}/shoptet-shipment-methods`,
        );
        return response.body;
    }

    async getShoptetOrderStatuses(companyId: ObjectId): Promise<IShoptetOrderStatus[]> {
        let response = await this.got.get(
            `/company/${companyId}/shoptet-order-statuses`,
        );
        return response.body;
    }
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

export interface ApiOrderItem {
    sku: string;
    asin: string;
    marketplaceItemId: string;
    name: string;
    price: number;
    itemPrice: number;
    quantity: number;
    tax: number;
    promotionDiscount: number;
    promotionDiscountTax: number;
    shippingDiscount: number;
    shippingDiscountTax: number;
    shippingPrice: number;
    shippingTax: number;
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

export const ORDER_STATUSES = ["Unshipped", "Pending", "Shipped", "Canceled"];
export const AUTOPRICING_STATUSES = ['None', 'Pending', 'PendingTax', 'Done'];
export declare type ApiOrderStatus = 'Unshipped' | 'Pending' | 'Shipped' | 'Canceled'
export declare type ApiOrderFulfillmentChannel = 'FBA' | 'Seller';
export declare type ApiOrderPaymentMethod = string;

export interface ApiOrder {
    companyId: ObjectId;
    marketplaceOrderId: string;
    status: ApiOrderStatus;
    marketplace: MarketplaceName;
    fulfillmentChannel: ApiOrderFulfillmentChannel;
    totalPrice: number;
    totalItemTax: number;
    shippingPrice: number;
    totalDiscount: number;
    currencyCode: CurrencyCode;
    shipServiceLevel: string;
    paymentMethod: ApiOrderPaymentMethod;
    invoices: ApiInvoice[];
    buyer: ApiAddress;
    items: ApiOrderItem[];
    lastChanged: Date;
    latestShipDate: Date;
    latestDeliveryDate: Date;
    marketplaceLastChanged: Date;

    purchaseDate: Date;
    isPremiumOrder: boolean;
    isPrime: boolean;
    isBusinessOrder: boolean;
    isComplete: boolean;
    isRefunded: boolean;

    pendingDate?: Date;
    unshippedDate?: Date;
    shippedDate?: Date;
    canceledDate?: Date;

    autopricing?: IAutopricing[];
    autopricingTotal?: number;
    autopricingStatus?: 'None' | 'Pending' | 'PendingTax' | 'Done';

    /** For Mall-Shoptet delivery method mapping */
    mallDeliveryMethod?: string;
}

interface ApiDeliveryMethodsMapping {
    marketplace: MarketplaceName;
    method: string;
    serviceMethod: string;
}

export interface ApiImportSettings {
    companyId: ObjectId;
    marketplaceType: MarketplaceType;
    service: ServiceName;
    defaultOrderStatus: string;
    importOrderJustOnce: boolean;
    lowerStockOnOrder: boolean;
    synchronizeOrders: boolean;
    shipmentMethod?: string;
    synchronizeFbaOrders: boolean;
    carrier?: ApiCarrierName;
    carrierName?: string;
    deliveryMethodsMapping?: ApiDeliveryMethodsMapping[];
}

const optionalString = () => string().allow(null, "").optional();

export const ADDRESS_JOI_SCHEMA = object({
    name: optionalString(),
    email: optionalString(),
    addressLine: array().items(string().allow("")),
    city: optionalString(),
    country: optionalString(),
    district: optionalString(),
    stateOrRegion: optionalString(),
    zipCode: optionalString(),
    countryCode: optionalString(),
    phone: optionalString(),
    taxId: optionalString(),
    taxCountry: optionalString(),
});

export const ORDER_ITEM_JOI_SCHEMA = object({
    sku: string().required(),
    asin: optionalString(),
    marketplaceItemId: optionalString(),
    name: string(),
    price: number(),
    itemPrice: number().allow(null),
    quantity: number().integer(),
    tax: number(),
    promotionDiscount: number(),
    promotionDiscountTax: number(),
    shippingDiscount: number(),
    shippingDiscountTax: number(),
    shippingTax: number(),
    shippingPrice: number(),
});

export const ORDER_INVOICE_JOI_SCHEMA = object({
    id: string().allow(null, ""),
    url: string().allow(null, ""),
});

export const ORDER_AUTOPRICING_SCHEMA = object({
    sku: string(),
    delta: number().allow(null),
    base: number().allow(null),
    autoprice: number().allow(null),
    date: date().allow(null)
});

export const ORDER_JOI_SCHEMA = object({
    companyId: string().required(),
    marketplaceOrderId: string().required(),
    status: string().allow(ORDER_STATUSES),
    marketplace: string().allow(MARKETPLACES),
    fulfillmentChannel: string(),
    totalPrice: number(),
    totalItemTax: number(),
    shippingPrice: number().optional(),
    totalDiscount: number(),
    currencyCode: string().allow(CURRENCY_CODES),
    shipServiceLevel: optionalString(),
    paymentMethod: optionalString(),
    invoices: array().items(ORDER_INVOICE_JOI_SCHEMA),
    buyer: ADDRESS_JOI_SCHEMA,
    items: array().items(ORDER_ITEM_JOI_SCHEMA).optional(),
    lastChanged: date(),
    latestShipDate: date().allow(null),
    latestDeliveryDate: date().allow(null),

    purchaseDate: date().allow(null),
    isPremiumOrder: bool(),
    isPrime: bool(),
    isBusinessOrder: bool(),
    isComplete: bool(),
    isRefunded: bool(),

    marketplaceLastChanged: date().allow(null),
    pendingDate: date().allow(null),
    unshippedDate: date().allow(null),
    shippedDate: date().allow(null),
    canceledDate: date().allow(null),

    autopricing: array().items(ORDER_AUTOPRICING_SCHEMA).allow(null).optional(),
    autopricingTotal: number().allow(null).optional(),
    autopricingStatus: string().allow([null, ...AUTOPRICING_STATUSES]).optional(),
    mallDeliveryMethod: string().allow(null)
}).options({stripUnknown: true});
