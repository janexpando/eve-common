import { allow, alternatives, array, bool, date, number, object, string } from 'joi';
import { AUTOPRICING_STATUSES, ORDER_STATUSES } from './order-model';
import { CURRENCY_CODES, MARKETPLACES } from '..';
import { COUNTRY_CODES } from '../models/country-codes';

export const PAYMENT_METHODS = ['CreditCard', 'CashOnDelivery', 'BankTransfer'];

export const PAYMENT_STATUS = ['Unpaid', 'Paid'];

export const optionalString = () =>
    string()
        .allow(null, '')
        .optional();

export const PRICE_JOI_SCHEMA = object({
    withTax: number(),
    withoutTax: number(),
    tax: number(),
    taxRatePercent: number(),
});

export const ORDER_PRICE_JOI_SCHEMA = object({
    items: PRICE_JOI_SCHEMA,
    delivery: PRICE_JOI_SCHEMA,
    payment: PRICE_JOI_SCHEMA,
    totalDiscount: PRICE_JOI_SCHEMA,
    total: PRICE_JOI_SCHEMA,
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

    deliveryItemIds: array()
        .items(string())
        .allow(null)
        .optional(),
    lineItemPrice: PRICE_JOI_SCHEMA.required(),
    lineItemDiscount: PRICE_JOI_SCHEMA,
    deliveryPrice: PRICE_JOI_SCHEMA,
    deliveryDiscount: PRICE_JOI_SCHEMA,
    marketplaceCommission: PRICE_JOI_SCHEMA,
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

export const ORDER_ADDRESS_JOI_SCHEMA = object({
    companyName: string(),
    name: string().required(),
    email: string(),
    phone: string().required(),
    addressLine: array()
        .items(string())
        .required(),
    city: string().required(),
    province: string(),
    zip: string().required(),
    countryCode: string()
        .valid(COUNTRY_CODES)
        .required(),
    note: string(),
});

export const DELIVERY_JOI_SCHEMA = object({
    shippingCarrier: string().optional(),
    shippingCarrierService: string().optional(),
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

export const ORDER_PAYMENT_SCHEMA = object({
    cashOnDelivery: object({
        toPay: number(),
        servicePrice: number(),
    }),
    paymentMethod: string()
        .valid(PAYMENT_METHODS)
        .required(),
    paymentStatus: string().valid(PAYMENT_STATUS),
});

export const ORDER_JOI_SCHEMA = object({
    companyId: string().required(),
    marketplaceOrderId: string().required(),
    status: string().allow(ORDER_STATUSES),
    marketplace: string().allow(MARKETPLACES),
    fulfillmentId: string(),
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
    billingAddress: ORDER_ADDRESS_JOI_SCHEMA.concat(
        object({
            taxId: string(),
            taxCountry: string(),
            vatNo: string(),
        }),
    ),
    delivery: DELIVERY_JOI_SCHEMA,
    deliveryAddress: ORDER_ADDRESS_JOI_SCHEMA,
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

    payment: ORDER_PAYMENT_SCHEMA.required(),

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
    packageLabels: string()
        .allow(null)
        .optional(),

    price: ORDER_PRICE_JOI_SCHEMA.required(),
}).options({ stripUnknown: true });
