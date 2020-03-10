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

    // alza specific fields
    companyName?: string;
    note?: string;
}

export interface ApiInvoice {
    id: string;
    url: string;
}

export const AUTOPRICING_STATUSES = ['None', 'Pending', 'Done'];

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

    alzaBarCodes?: string[];
}

export declare type ApiOrderStatus = 'Unshipped' | 'Pending' | 'Shipped' | 'Canceled';

export declare type OrderPaymentMethod = string;

export declare type OrderFulfillmentChannel = 'FBA' | 'Seller';

export enum DropshipShippingCarrier {
    CZPOSTD = 'CZPOSTD',
    CZPOSTP = 'CZPOSTP',
    DHL = 'DHL',
    DPD = 'DPD',
    GEIS = 'GEIS',
    GEISPOINT = 'GEISPOINT',
    GEISCARGO = 'GEISCARGO',
    GLS = 'GLS',
    GO = 'GO',
    MagyarPOST = 'MagyarPOST',
    MagyarPOSTHD = 'MagyarPOSTHD',
    MagyarPOSTPO = 'MagyarPOSTPO',
    MagyarPOSTPP = 'MagyarPOSTPP',
    MagyarPOSTPT = 'MagyarPOSTPT',
    Najbert = 'Najbert',
    PPL = 'PPL',
    PPLPARCELSHOP = 'PPLPARCELSHOP',
    RHENUS = 'RHENUS',
    SKPOSTD = 'SKPOSTD',
    SKPOSTP = 'SKPOSTP',
    SKYNET = 'SKYNET',
    TOPTRANS = 'TOPTRANS',
    UPS = 'UPS',
    ZASILKOVNA = 'ZASILKOVNA',
    ZavolejSiKuryra = 'ZavolejSiKuryra',
    Supplier = 'Supplier',
}

export enum DropshipParcelShop {
    GEISPOINT = 'GEISPOINT',
    PPLPARCELSHOP = 'PPLPARCELSHOP',
    ZASILKOVNA = 'ZASILKOVNA',
}

export enum DropshipShipmentDeliveryType {
    B2C = 'B2C',
    B2B = 'B2B',
    Branch = 'Branch',
    ParcelShop = 'ParcelShop',
}

export enum DropshipCurrencyCode {
    CZK = 'CZK',
    EUR = 'EUR',
    USD = 'USD',
}

export interface ApiOrder {
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

    // alza specific fields
    customerId?: number; // Alza customer id assigned by Alza
    supplierBranchId?: number; // Alza branch id assigned by Alza
    regNo?: string; // ičo
    vatNo?: string; // dič
    shippingCarrierIdentification?: DropshipShippingCarrier;
    parcelShop?: { parcelShopIdentification?: DropshipParcelShop; parcelShopBranchCode?: string };
    shipmentDeliveryType?: DropshipShipmentDeliveryType;
    demandedExpeditionDate?: Date;
    cashOnDeliveryValue?: number;
    cashOnDeliveryValueCurrency?: DropshipCurrencyCode;
    paymentVS?: string;
    deliveryBranchId?: number;
    shipmentValue?: number;
    shipmentValueCurrency?: DropshipCurrencyCode;
}

export const ORDER_STATUSES = ['Unshipped', 'Pending', 'Shipped', 'Canceled'];
export enum OrderStatus {
    Pending = 'Pending',
    Unshipped = 'Unshipped',
    Shipped = 'Shipped',
    Canceled = 'Canceled',
}
