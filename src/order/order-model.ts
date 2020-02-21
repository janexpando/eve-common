import {ObjectId} from "bson";
import {ApiAddress, ApiInvoice, CurrencyCode, IAutopricing, MarketplaceName} from "..";

export interface OrderItem {
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

    alzaBarCodes?: string[];
}

export declare type ApiOrderStatus = 'Unshipped' | 'Pending' | 'Shipped' | 'Canceled';

export declare type OrderPaymentMethod = string;

export declare type OrderFulfillmentChannel = 'FBA' | 'Seller';

export interface Order {
    companyId: ObjectId;
    marketplaceOrderId: string;
    status: ApiOrderStatus;
    marketplace: MarketplaceName;
    fulfillmentChannel: OrderFulfillmentChannel;
    totalPrice: number;
    totalItemTax: number;
    shippingPrice: number;
    totalDiscount: number;
    currencyCode: CurrencyCode;
    shipServiceLevel: string;
    paymentMethod: OrderPaymentMethod;
    invoices: ApiInvoice[];
    buyer: ApiAddress;
    items: OrderItem[];
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
    autopricingHistory?: IAutopricing[];
    autopricingTotal?: number;
    autopricingStatus?: 'None' | 'Pending' | 'Done';

    mallDeliveryMethod?: string;

    customerId?: number; // Alza customer id assigned by Alza
    supplierBranchId?: number; // Alza branch id assigned by Alza
    regNo?: string; // ičo
    vatNo?: string; // dič
}

export const ORDER_STATUSES = ['Unshipped', 'Pending', 'Shipped', 'Canceled'];
export enum OrderStatus {
    Pending = 'Pending',
    Unshipped = 'Unshipped',
    Shipped = 'Shipped',
    Canceled = 'Canceled',
}
