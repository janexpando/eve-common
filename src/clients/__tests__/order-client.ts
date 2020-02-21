import { ObjectId } from 'bson';
import { prepareDB, provideInjector, test } from '../../testing';
import { DbDriver, Environment, ENVIRONMENT_PROVIDER, Order, OrderClient } from '../..';
import nock = require('nock');

provideInjector(test, [OrderClient, ENVIRONMENT_PROVIDER]);
prepareDB(test);

test.serial('store orders', async t => {
    // nock.recorder.rec();
    try {
        const cid = '5c52d0bfbf23ae00046927a8';
        let companyId = new ObjectId(cid);
        let environment = t.context.injector.get(Environment);

        nock(process.env.GATEWAY_URL, { encodedQueryParams: true })
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
                'Fri, 21 Feb 2020 00:57:04 GMT',
                'Connection',
                'close',
            ]);

        const ordersToStore: Order[] = [
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

        await t.context.injector.get(OrderClient).storeOrders(companyId, ordersToStore);

        /**
         *  `mongo be like dbDriver.db.db.db.db.db.db...`
         *  `for my very vast need of clean simple example`
         *  `feel the vibe of that code:`
         *  `https://open.spotify.com/track/4CWPTOiuxWE3AcBLJGAA1H?si=jKJJhg56RLOQJNjy7hJH7g`
         *
         *  var MongoClient = require('mongodb').MongoClient;
         *  var url = "mongodb://localhost:27017/";
         *  MongoClient.connect(url, function(err, db) {
         *      if (err) throw err;
         *      var dbo = db.db("mydb");
         *      dbo.collection("customers").findOne({}, function(err, result) {
         *          if (err) throw err;
         *          console.log(result.name);
         *          db.close();
         *      });
         *  });
         */

        const db = t.context.injector.get(DbDriver).db.db;
        const ordersCollection = db.collection('orders');
        const order1 = await ordersCollection.findOne({
            companyId,
            marketplaceOrderId: ordersToStore[0].marketplaceOrderId,
        });
        const order2 = await ordersCollection.findOne({
            companyId,
            marketplaceOrderId: ordersToStore[1].marketplaceOrderId,
        });
        t.deepEqual(ordersToStore[0]?.marketplaceOrderId, order1?.marketplaceOrderId);
        t.deepEqual(ordersToStore[1]?.marketplaceOrderId, order2?.marketplaceOrderId);
    } catch (e) {
        console.log(e);
    }
});
