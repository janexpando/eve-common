import { ObjectId } from 'bson';
import { provideInjector, test } from '../../testing';
import nock = require('nock');
import { OrderClient } from '../order-client';
import { Environment, ENVIRONMENT_PROVIDER } from '../..';
import { ApiOrder } from '../../order/order-model';

provideInjector(test, [OrderClient, ENVIRONMENT_PROVIDER]);

test.serial('store orders', async t => {
    // nock.recorder.rec();

    const cid = '5c52d0bfbf23ae00046927a8';
    let companyId = new ObjectId(cid);
    const environment = t.context.injector.get(Environment);

    nock(environment.GATEWAY_URL, { encodedQueryParams: true })
        .post('/company/5c52d0bfbf23ae00046927a8/orders', [
            {
                companyId: '5c52d0bfbf23ae00046927a8',
                marketplace: 'amazon_uk',
                marketplaceOrderId: '000000',
                lastChanged: '2019-01-01T12:00:00.000Z',
                buyer: {
                    name: 'Vojtěch Zogata',
                    addressLine: ['Havlíčkova 13'],
                    city: 'Praha',
                    countryCode: 'CZ',
                    country: 'Czechia',
                    district: '1',
                    phone: '123 456 789',
                    zipCode: '190 00',
                    stateOrRegion: 'Praha',
                    email: 'vojta@expan.do',
                    taxId: 'abcd',
                    taxCountry: 'CZ',
                },
                currencyCode: 'EUR',
                items: [],
                fulfillmentChannel: 'FBA',
                status: 'Shipped',
                totalPrice: 500,
                totalItemTax: 0,
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
            },
            {
                companyId: '5c52d0bfbf23ae00046927a8',
                marketplace: 'amazon_de',
                marketplaceOrderId: '000001',
                lastChanged: '2019-01-01T12:00:00.000Z',
                buyer: {
                    name: 'Vojtěch Zogata',
                    addressLine: ['Havlíčkova 13'],
                    city: 'Praha',
                    countryCode: 'CZ',
                    country: 'Czechia',
                    district: '1',
                    phone: '123 456 789',
                    zipCode: '190 00',
                    stateOrRegion: 'Praha',
                    email: 'vojta@expan.do',
                    taxId: 'abcd',
                    taxCountry: 'CZ',
                },
                currencyCode: 'EUR',
                items: [],
                fulfillmentChannel: 'FBA',
                status: 'Shipped',
                totalPrice: 500,
                totalItemTax: 0,
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
            companyId,
            marketplace: 'amazon_uk',
            marketplaceOrderId: '000000',
            lastChanged: new Date('2019-01-01T12:00:00Z'),
            buyer: {
                name: 'Vojtěch Zogata',
                addressLine: ['Havlíčkova 13'],
                city: 'Praha',
                countryCode: 'CZ',
                country: 'Czechia',
                district: '1',
                phone: '123 456 789',
                zipCode: '190 00',
                stateOrRegion: 'Praha',
                email: 'vojta@expan.do',
                taxId: 'abcd',
                taxCountry: 'CZ',
            },
            currencyCode: 'EUR',
            items: [],
            fulfillmentChannel: 'FBA',
            status: 'Shipped',
            totalPrice: 500,
            totalItemTax: 0,
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
        },
        {
            companyId,
            marketplace: 'amazon_de',
            marketplaceOrderId: '000001',
            lastChanged: new Date('2019-01-01T12:00:00Z'),
            buyer: {
                name: 'Vojtěch Zogata',
                addressLine: ['Havlíčkova 13'],
                city: 'Praha',
                countryCode: 'CZ',
                country: 'Czechia',
                district: '1',
                phone: '123 456 789',
                zipCode: '190 00',
                stateOrRegion: 'Praha',
                email: 'vojta@expan.do',
                taxId: 'abcd',
                taxCountry: 'CZ',
            },
            currencyCode: 'EUR',
            items: [],
            fulfillmentChannel: 'FBA',
            status: 'Shipped',
            totalPrice: 500,
            totalItemTax: 0,
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
        },
    ];

    const orderClient = t.context.injector.get(OrderClient);
    const response = await orderClient.storeOrders(companyId, ordersToStore);

    t.deepEqual(response?.body, { message: 'received' });
});

test.serial('store orders throws error', async t => {
    // nock.recorder.rec()
    const cid = '5c52d0bfbf23ae00046927a8';
    let companyId = new ObjectId(cid);

    const ordersToStore: ApiOrder[] = [
        {
            companyId,
            marketplace: 'amazon_uk',
            marketplaceOrderId: '000000',
            lastChanged: new Date('2019-01-01T12:00:00Z'),
            buyer: {
                name: 'Vojtěch Zogata',
                addressLine: ['Havlíčkova 13'],
                city: 'Praha',
                countryCode: 'CZ',
                country: 'Czechia',
                district: '1',
                phone: '123 456 789',
                zipCode: '190 00',
                stateOrRegion: 'Praha',
                email: 'vojta@expan.do',
                taxId: 'abcd',
                taxCountry: 'CZ',
            },
            currencyCode: 'EUR',
            items: [],
            fulfillmentChannel: 'FBA',
            status: 'Shipped',
            totalPrice: 500,
            totalItemTax: 0,
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
        },
        {
            companyId,
            marketplace: 'amazon_de',
            marketplaceOrderId: '000001',
            lastChanged: new Date('2019-01-01T12:00:00Z'),
            buyer: {
                name: 'Vojtěch Zogata',
                addressLine: ['Havlíčkova 13'],
                city: 'Praha',
                countryCode: 'CZ',
                country: 'Czechia',
                district: '1',
                phone: '123 456 789',
                zipCode: '190 00',
                stateOrRegion: 'Praha',
                email: 'vojta@expan.do',
                taxId: 'abcd',
                taxCountry: 'CZ',
            },
            currencyCode: 'EUR',
            items: [],
            fulfillmentChannel: 'FBA',
            status: 'Shipped',
            totalPrice: 500,
            totalItemTax: 0,
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
        },
    ];

    const orderClient = t.context.injector.get(OrderClient);
    try {
        await orderClient.storeOrders(companyId, ordersToStore);
    } catch (e) {
        t.deepEqual(e.message, 'Orders with id: 000000,000001 not received successfully.');
    }
});
