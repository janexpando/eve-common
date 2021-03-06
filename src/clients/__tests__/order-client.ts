import { ObjectId } from 'bson';
import { provideInjector, test } from '../../testing';
import nock = require('nock');
import { OrderClient } from '../order-client';
import { ApiAddress, ApiOrderAddress, Environment, ENVIRONMENT_PROVIDER } from '../..';
import { ApiOrder } from '../../order/order-model';

provideInjector(test, [OrderClient, ENVIRONMENT_PROVIDER]);

test.serial('store orders', async t => {
    // nock.recorder.rec();

    const cid = '5c52d0bfbf23ae00046927a8';
    let companyId = new ObjectId(cid);
    const orderId1 = new ObjectId();
    const orderId2 = new ObjectId();
    const environment = t.context.injector.get(Environment);

    const buyer: ApiAddress = {
        name: 'Vojtěch Zogata',
        addressLine: ['Havlíčkova 13'],
        city: 'Praha',
        countryCode: 'CZ',
        country: 'Czechia',
        district: '1',
        zipCode: '190 00',
        stateOrRegion: 'Praha',
        email: 'vojta@expan.do',
        phone: '123 456 789',
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

    nock(environment.GATEWAY_URL, { encodedQueryParams: true })
        .post('/company/5c52d0bfbf23ae00046927a8/orders', [
            {
                _id: orderId1.toHexString(),
                companyId: '5c52d0bfbf23ae00046927a8',
                marketplace: 'amazon_uk',
                marketplaceOrderId: '000000',
                lastChanged: '2019-01-01T12:00:00.000Z',
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
                    paymentStatus: 'Paid',
                },
                paymentMethod: 'Other',
                purchaseDate: '2019-01-01T11:00:00.000Z',
                marketplaceLastChanged: '2019-01-01T11:00:00.000Z',
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
            {
                _id: orderId2.toHexString(),
                companyId: '5c52d0bfbf23ae00046927a8',
                marketplace: 'amazon_de',
                marketplaceOrderId: '000001',
                lastChanged: '2019-01-01T12:00:00.000Z',
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
                    paymentStatus: 'Paid',
                },
                paymentMethod: 'Other',
                purchaseDate: '2019-01-01T11:00:00.000Z',
                marketplaceLastChanged: '2019-01-01T11:00:00.000Z',
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
        ] as any)
        .reply(200, { message: 'received' }, [
            'X-DNS-Prefetch-Control',
            'off',
            'Strict-Transport-Security',
            'max-age=15552000; includeSubDomains',
            'X-Download-Options',
            'noopen',
            'X-Content-Type-Options',
            'nosniff',
            'X-XSS-Protection',
            '1; mode=block',
            'Vary',
            'Origin',
            'Content-Type',
            'application/json; charset=utf-8',
            'Content-Length',
            '22',
            'Date',
            'Sat, 22 Feb 2020 15:39:37 GMT',
            'Connection',
            'close',
        ]);
    const ordersToStore: ApiOrder[] = [
        {
            _id: orderId1,
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
                paymentStatus: 'Paid',
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
        },
        {
            _id: orderId2,
            companyId,
            marketplace: 'amazon_de',
            marketplaceOrderId: '000001',
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
                paymentStatus: 'Paid',
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
        },
    ];

    const orderClient = t.context.injector.get(OrderClient);
    const response = await orderClient.storeOrders(companyId, ordersToStore);

    t.deepEqual(response?.body, { message: 'received' });
});

test.serial('Get order', async t => {
    // nock.recorder.rec();
    const cid = '5c52d0bfbf23ae00046927a8';
    const companyId = new ObjectId(cid);
    const marketplace = 'amazon_it';
    const marketplaceOrderId = 'marketplaceOrderId';
    const environment = t.context.injector.get(Environment);
    const orderClient = t.context.injector.get(OrderClient);

    const buyer: ApiAddress = {
        name: 'gsgrwger',
        email: 'asdfawef',
        phone: '123',
        taxCountry: 'CZ',
        taxId: '321',
        addressLine: ['awegw'],
        city: 'city',
        country: 'IT',
        zipCode: '123',
        countryCode: 'IT',
        stateOrRegion: 'asdf',
        district: 'asdf',
    };

    const deliveryAddress: ApiOrderAddress = {
        name: 'gsgrwger',
        email: 'asdfawef',
        phone: '123',
        addressLine: ['awegw'],
        city: 'city',
        zip: '123',
        countryCode: 'IT',
    };

    nock(environment.GATEWAY_URL, { encodedQueryParams: true })
        .get(`/company/${cid}/marketplace/${marketplace}/marketplaceOrderId/${marketplaceOrderId}/order`)
        .reply(
            200,
            {
                _id: '5c89092c4f96ed4e1aae3820',
                companyId: '5c52d0bfbf23ae00046927a8',
                marketplaceOrderId: 'marketplaceOrderId',
                status: 'Shipped',
                marketplace: 'amazon_it',
                fulfillmentChannel: 'FBA',
                totalPrice: 22.3,
                currencyCode: 'EUR',
                payment: {
                    paymentMethod: 'CreditCard',
                    paymentStatus: 'Paid',
                },
                paymentMethod: 'Other',
                buyer,
                deliveryAddress,
                items: [
                    {
                        marketplaceItemId: 'asdfasdf',
                        sku: 'sdf',
                        asin: 'sdaf',
                        price: 11.15,
                        itemPrice: 11.15,
                        tax: 0,
                        name: 'product name',
                        quantity: 1,
                        promotionDiscount: 0,
                        promotionDiscountTax: 0,
                    },
                    {
                        marketplaceItemId: 'asdfasdf',
                        sku: 'asdf',
                        asin: 'qwegq',
                        price: 11.15,
                        itemPrice: 11.15,
                        tax: 0,
                        name: 'product name2',
                        quantity: 1,
                        promotionDiscount: 0,
                        promotionDiscountTax: 0,
                    },
                ],
                lastChanged: '2019-03-14T17:11:37.684Z',
                purchaseDate: '2019-03-13T13:29:52.711Z',
                shipServiceLevel: 'Expedited',
                isBusinessOrder: false,
                isPremiumOrder: false,
                isPrime: false,
                isComplete: false,
                marketplaceLastChanged: '2019-03-13T16:39:44.242Z',
                totalItemTax: 0,
                isRefunded: false,
                invoices: [],
            },
            [
                'X-DNS-Prefetch-Control',
                'off',
                'Strict-Transport-Security',
                'max-age=15552000; includeSubDomains',
                'X-Download-Options',
                'noopen',
                'X-Content-Type-Options',
                'nosniff',
                'X-XSS-Protection',
                '1; mode=block',
                'Vary',
                'Origin',
                'Content-Type',
                'application/json; charset=utf-8',
                'Content-Length',
                '1453',
                'Date',
                'Fri, 06 Mar 2020 17:10:20 GMT',
                'Connection',
                'close',
            ],
        );
    const response = await orderClient.getOrder(companyId, marketplace, marketplaceOrderId);
    t.is(response.marketplaceOrderId, 'marketplaceOrderId');
});
