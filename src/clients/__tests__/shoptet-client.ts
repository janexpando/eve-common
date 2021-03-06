import * as nock from 'nock';
import { ObjectId } from 'bson';
import { provideInjector, test } from '../../testing';
import { ShoptetServiceClient } from '../shoptet-service-client';
import { ApiAddress, ApiOrderAddress, Environment, ENVIRONMENT_PROVIDER } from '../..';
import { ApiImportSettings } from '../../settings/import-settings-model';
import { ApiOrder } from '../../order/order-model';

provideInjector(test, [ShoptetServiceClient, ENVIRONMENT_PROVIDER]);

test.serial('send orders', async t => {
    t.plan(1);
    const client = t.context.injector.get(ShoptetServiceClient);
    const companyId = new ObjectId();
    const buyer: ApiAddress = {
        name: 'Vojtěch Zogata',
        email: 'vojta@expan.do',
        phone: '123 456 789',
        addressLine: ['Havlíčkova 13'],
        city: 'Praha',
        countryCode: 'CZ',
        country: 'Czechia',
        district: '1',
        zipCode: '190 00',
        stateOrRegion: 'Praha',
        taxId: 'abcd',
        taxCountry: 'CZ',
    };
    const deliveryAddress: ApiOrderAddress = {
        name: 'Vojtěch Zogata',
        email: 'vojta@expan.do',
        phone: '123 456 789',
        addressLine: ['Havlíčkova 13'],
        city: 'Praha',
        zip: '190 00',
        countryCode: 'CZ',
    };
    const order: ApiOrder = {
        _id: new ObjectId(),
        companyId,
        marketplace: 'amazon_uk',
        marketplaceOrderId: '000000',
        lastChanged: new Date('2019-01-01T12:00:00Z'),
        buyer,
        deliveryAddress,
        currencyCode: 'EUR',
        items: [],
        fulfillmentChannel: 'FBA',
        status: 'Shipped',
        totalPrice: 500,
        totalItemTax: 0,
        payment: {
            paymentMethod: 'CreditCard',
        },
        paymentMethod: 'Other',
        purchaseDate: new Date('2019-01-01T11:00:00Z'),
        marketplaceLastChanged: new Date('2019-01-01T11:00:00Z'),
        shipServiceLevel: 'expedited',
        isBusinessOrder: false,
        isComplete: false,
        invoices: [],
        isPremiumOrder: false,
        isPrime: false,
        shippingPrice: 0,
        latestShipDate: new Date('2019-01-01T12:00:00Z'),
        latestDeliveryDate: new Date('2019-01-01T12:00:00Z'),
        totalDiscount: 0,
        isRefunded: false,
        price: {
            total: {
                withTax: 5000,
            },
        },
    };
    let settings: ApiImportSettings = {
        companyId,
        carrier: 'Other',
        carrierName: 'carrier',
        defaultOrderStatus: 'dos',
        orderDeliveredOnStatus: '',
        orderShippingOnStatus: '',
        deliveryMethodsMapping: [],
        importOrderJustOnce: false,
        lowerStockOnOrder: true,
        marketplaceType: 'amazon',
        service: 'shoptet',
        shipmentMethod: 'sm',
        synchronizeFbaOrders: false,
        synchronizeOrders: true,
    };
    delete order.marketplaceLastChanged;
    let orders: ApiOrder[] = [order];
    nocks(companyId, order, t.context.injector.get(Environment));
    let response = await client.postOrders(companyId, orders, settings);
    t.is(response.statusCode, 200);
});

function nocks(companyId: ObjectId, order: ApiOrder, environment: Environment) {
    // nock.recorder.rec();
    nock(environment.SHOPTET_SERVICE_URL, { encodedQueryParams: true })
        .post(`/company/${companyId.toHexString()}/orders`, {
            orders: [
                {
                    _id: order._id.toHexString(),
                    companyId: order.companyId.toHexString(),
                    marketplace: 'amazon_uk',
                    marketplaceOrderId: '000000',
                    lastChanged: '2019-01-01T12:00:00.000Z',
                    buyer: {
                        name: 'Vojtěch Zogata',
                        email: 'vojta@expan.do',
                        phone: '123 456 789',
                        addressLine: ['Havlíčkova 13'],
                        city: 'Praha',
                        countryCode: 'CZ',
                        country: 'Czechia',
                        district: '1',
                        zipCode: '190 00',
                        stateOrRegion: 'Praha',
                        taxId: 'abcd',
                        taxCountry: 'CZ',
                    },
                    deliveryAddress: {
                        name: 'Vojtěch Zogata',
                        email: 'vojta@expan.do',
                        phone: '123 456 789',
                        addressLine: ['Havlíčkova 13'],
                        city: 'Praha',
                        zip: '190 00',
                        countryCode: 'CZ',
                    },
                    currencyCode: 'EUR',
                    items: [],
                    fulfillmentChannel: 'FBA',
                    status: 'Shipped',
                    totalPrice: 500,
                    totalItemTax: 0,
                    paymentMethod: 'Other',
                    payment: {
                        paymentMethod: 'CreditCard',
                    },
                    purchaseDate: '2019-01-01T11:00:00.000Z',
                    shipServiceLevel: 'expedited',
                    isBusinessOrder: false,
                    isComplete: false,
                    invoices: [],
                    isPremiumOrder: false,
                    isPrime: false,
                    shippingPrice: 0,
                    latestShipDate: '2019-01-01T12:00:00.000Z',
                    latestDeliveryDate: '2019-01-01T12:00:00.000Z',
                    totalDiscount: 0,
                    isRefunded: false,
                    price: {
                        total: {
                            withTax: 5000,
                        },
                    },
                },
            ],
            settings: {
                companyId: companyId.toHexString(),
                carrier: 'Other',
                carrierName: 'carrier',
                defaultOrderStatus: 'dos',
                orderDeliveredOnStatus: '',
                orderShippingOnStatus: '',
                deliveryMethodsMapping: [],
                importOrderJustOnce: false,
                lowerStockOnOrder: true,
                marketplaceType: 'amazon',
                service: 'shoptet',
                shipmentMethod: 'sm',
                synchronizeFbaOrders: false,
                synchronizeOrders: true,
            },
        })
        .reply(200, {}, [
            'Content-Type',
            'application/json; charset=utf-8',
            'Content-Length',
            '2',
            'Date',
            'Fri, 26 Apr 2019 13:20:04 GMT',
            'Connection',
            'close',
        ] as any);
}
