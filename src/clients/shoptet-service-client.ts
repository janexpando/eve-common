import { Injectable } from 'injection-js';
import {EveClient} from "./eve-client";
import {ObjectId} from "bson";
import {Environment} from "..";
import {MarketplaceName} from "..";
import {CurrencyCode} from "..";

@Injectable()
export class ShoptetServiceClient extends EveClient {
    constructor(env: Environment) {
        super(env);
        this.baseUrl = env.SHOPTET_SERVICE_URL;
    }

    async postOrders(companyId: ObjectId, orders: ApiOrder[]) {
        return await this.got.post(
            `/company/${companyId}/orders`,
            {
                body: {
                    orders,
                },
            },
        );
    }
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

export declare type ApiOrderStatus =
    | 'Unshipped'
    | 'Pending'
    | 'Shipped'
    | 'Canceled';
export declare type ApiFulfilmentChannel = 'FBA' | 'Seller';
export declare type ApiPaymentMethod = string;

export interface ApiOrder {
    companyId: ObjectId;
    marketplaceOrderId: string;
    status: ApiOrderStatus;
    marketplace: MarketplaceName;
    fulfillmentChannel: ApiFulfilmentChannel;
    totalPrice: number;
    totalItemTax: number;
    shippingPrice?: number;
    currencyCode: CurrencyCode;
    paymentMethod: ApiPaymentMethod;
    invoiceUrls: string[];
    shipServiceLevel: string;
    buyer: ApiAddress;
    items: ApiOrderItem[];
    lastChanged: Date;
    marketplaceLastChanged: Date;
    purchaseDate: Date;
    isPremiumOrder: boolean;
    isPrime: boolean;
    isBusinessOrder: boolean;
    isComplete: boolean;

    pendingDate?: Date;
    unshippedDate?: Date;
    shippedDate?: Date;
    canceledDate?: Date;
}
