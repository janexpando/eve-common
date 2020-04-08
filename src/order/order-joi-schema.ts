import { array, bool, date, number, object, string } from 'joi';
import { AUTOPRICING_STATUSES, ORDER_STATUSES } from './order-model';
import { CURRENCY_CODES, MARKETPLACES } from '..';

export const optionalString = () =>
    string()
        .allow(null, '')
        .optional();

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

    alzaBarCodes: array()
        .items(string())
        .allow(null)
        .optional(),
});
export const ADDRESS_JOI_SCHEMA = object({
    name: optionalString(),
    email: optionalString(),
    addressLine: array().items(string().allow('')),
    city: optionalString(),
    country: optionalString(),
    district: optionalString(),
    stateOrRegion: optionalString(),
    zipCode: optionalString(),
    countryCode: optionalString(),
    phone: optionalString(),
    taxId: optionalString(),
    taxCountry: optionalString(),
    regNo: string().optional(), // ičo
    vatNo: string().optional(), // dič
    companyName: string()
        .allow('')
        .optional(),
    note: string()
        .allow('')
        .optional(),
});
export const ORDER_INVOICE_JOI_SCHEMA = object({
    id: string().allow(null, ''),
    url: string().allow(null, ''),
});
export const ORDER_AUTOPRICING_SCHEMA = object({
    sku: string(),
    delta: number().allow(null),
    base: number().allow(null),
    autoprice: number().allow(null),
    date: date().allow(null),
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
    items: array()
        .items(ORDER_ITEM_JOI_SCHEMA)
        .optional(),
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

    autopricing: array()
        .items(ORDER_AUTOPRICING_SCHEMA)
        .allow(null)
        .optional(),
    autopricingHistory: array()
        .items(ORDER_AUTOPRICING_SCHEMA)
        .allow(null)
        .optional(),
    autopricingTotal: number()
        .allow(null)
        .optional(),
    autopricingStatus: string()
        .allow([null, ...AUTOPRICING_STATUSES])
        .optional(),

    /** For Mall-Shoptet delivery method mapping */
    mallDeliveryMethod: string().allow(null),

    /** Data related to Alza order */
    shippingCarrierIdentification: string().optional(),
    parcelShop: object({
        parcelShopIdentification: string().optional(),
        parcelShopBranchCode: string().optional(),
    }),
    demandedExpeditionDate: date()
        .allow('')
        .optional(),
    cashOnDelivery: object({
        value: number().optional(),
        currency: string()
            .allow(CURRENCY_CODES)
            .optional(),
        variableSymbol: string().optional(),
    }).optional(),
    deliveryBranchId: number().optional(),
    shipmentValue: number().optional(),
    shipmentValueCurrency: string()
        .allow(CURRENCY_CODES)
        .optional(),
    packageLabels: string().optional(),
}).options({ stripUnknown: true });
