import { ObjectId } from 'bson';
import { CurrencyCode, MarketplaceName } from '..';

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
    regNo?: string;
    vatNo?: string;
    companyName?: string;
    note?: string;
}

export interface ApiInvoice {
    id: string;
    url: string;
}

export const AUTOPRICING_STATUSES = ['None', 'Pending', 'Done'];

export interface IPrice {
    withTax?: number;
    withoutTax?: number;
    tax?: number;
    taxRatePercent?: number;
}

export interface IAutopricing {
    sku: string;
    delta: number;
    base: number;
    autoprice?: number;
    date?: Date;
}

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
    deliveryItemIds?: string[];

    lineItemPrice: IPrice;
    lineItemDiscount?: IPrice;
    deliveryPrice?: IPrice;
    deliveryDiscount?: IPrice;
    marketplaceCommission?: IPrice;
}

export interface ApiOrderDelivery {
    shippingCarrier?: string;
    shippingCarrierService?: string;
}

export declare type OrderPaymentMethod = 'CreditCard' | 'CashOnDelivery' | 'BankTransfer';

export declare type OrderPaymentStatus = 'Paid' | 'NotPaid';

export interface IPayment {
    cashOnDelivery?: {
        toPay?: number;
        servicePrice?: number;
    };
    paymentMethod: OrderPaymentMethod;
    paymentStatus?: OrderPaymentStatus;
}

export declare type ApiOrderStatus = 'Unshipped' | 'Pending' | 'Shipped' | 'Canceled';

export declare type OrderFulfillmentChannel = 'FBA' | 'Seller' | 'MediatedCarrier' | 'eMag';

export interface ApiOrder {
    _id?: ObjectId;
    companyId: ObjectId;
    marketplaceOrderId: string;
    status: ApiOrderStatus;
    marketplace: MarketplaceName;
    fulfillmentId?: ObjectId;
    fulfillmentChannel: OrderFulfillmentChannel;
    totalPrice: number;
    totalItemTax: number;
    shippingPrice: number;
    totalDiscount: number;
    currencyCode: CurrencyCode;
    shipServiceLevel: string;
    paymentMethod: string;
    invoices: ApiInvoice[];
    buyer: ApiAddress;
    buyerAddress?: { billing?: ApiAddress; shipping: ApiAddress };
    delivery?: ApiOrderDelivery;
    items: OrderItem[];
    lastChanged: Date;
    latestShipDate: Date;
    latestDeliveryDate: Date;
    marketplaceLastChanged: Date;
    packageLabels?: string | null;

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
    price: {
        items?: IPrice;
        delivery?: IPrice;
        payment?: IPrice;
        totalDiscount?: IPrice;
        total: IPrice;
    };

    // alza specific fields
    shippingCarrierIdentification?: string;
    parcelShop?: { parcelShopIdentification?: string; parcelShopBranchCode?: string };
    demandedExpeditionDate?: Date;
    payment: IPayment;
    cashOnDelivery?: {
        value?: number;
        currency?: CurrencyCode;
        variableSymbol?: string;
    };
    deliveryBranchId?: number;
    shipmentValue?: number;
    shipmentValueCurrency?: CurrencyCode;
}

export const ORDER_STATUSES = ['Unshipped', 'Pending', 'Shipped', 'Canceled'];
export enum OrderStatus {
    Pending = 'Pending',
    Unshipped = 'Unshipped',
    Shipped = 'Shipped',
    Canceled = 'Canceled',
}
