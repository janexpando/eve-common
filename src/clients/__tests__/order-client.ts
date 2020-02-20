import { provideInjector, test } from '../../testing';
import nock = require('nock');
import { ObjectId } from 'bson';
import { OrderClient } from '../order-client';
import { Order } from '../..';

provideInjector(test);

test('send orders to be stored', async t => {
    // nock.recorder.rec();
    const companyId = new ObjectId('5e3c16ef80039d91b45cf4cc');
    const orderClient = t.context.injector.get(OrderClient);
    const orders: Order[] = [
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
    await orderClient.storeOrders(companyId, orders);
});
