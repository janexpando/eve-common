import * as nock from 'nock';
import {ObjectId} from 'bson';
import {provideInjector, test} from "../../testing";
import {ApiOrder, ShoptetServiceClient} from "../shoptet-service-client";
import {Environment, ENVIRONMENT_PROVIDER} from "../..";

provideInjector(test, [ShoptetServiceClient, ENVIRONMENT_PROVIDER]);


test.serial('send orders', async t => {
    t.plan(1);
    let client = t.context.injector.get(ShoptetServiceClient);
    let companyId = new ObjectId();
    let order: ApiOrder = {
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
            taxCountry: 'CZ'
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
        invoiceUrls: [],
        isPremiumOrder: false,
        isPrime: false,
    };
    delete order.marketplaceLastChanged;
    let orders: ApiOrder[] = [order];
    nocks(companyId, order, t.context.injector.get(Environment));
    let response = await client.postOrders(companyId, orders);
    t.is(response.statusCode, 200);
});

function nocks(companyId: ObjectId, order: ApiOrder, environment: Environment) {
    // nock.recorder.rec();
    nock(environment.SHOPTET_SERVICE_URL, {'encodedQueryParams': true})
        .post(`/company/${companyId.toHexString()}/orders`, {
            'orders': [{
                'companyId': order.companyId.toHexString(),
                'marketplace': 'amazon_uk',
                'marketplaceOrderId': '000000',
                'lastChanged': '2019-01-01T12:00:00.000Z',
                'buyer': {
                    'name': 'Vojtěch Zogata', 'addressLine': ['Havlíčkova 13'], 'city': 'Praha', 'countryCode': 'CZ',
                    'country': 'Czechia', 'district': '1', 'phone': '123 456 789', 'zipCode': '190 00',
                    'stateOrRegion': 'Praha', 'email': 'vojta@expan.do', taxId: 'abcd',
                    taxCountry: 'CZ'
                },
                'currencyCode': 'EUR',
                'items': [],
                'fulfillmentChannel': 'FBA',
                'status': 'Shipped',
                'totalPrice': 500,
                'totalItemTax': 0,
                'paymentMethod': 'Other',
                'purchaseDate': '2019-01-01T11:00:00.000Z',
                'shipServiceLevel': 'expedited',
                'isBusinessOrder': false,
                'isComplete': false,
                'invoiceUrls': [],
                'isPremiumOrder': false,
                'isPrime': false,
            }],
        })
        .reply(200, {}, ['Content-Type',
            'application/json; charset=utf-8',
            'Content-Length',
            '2',
            'Date',
            'Fri, 26 Apr 2019 13:20:04 GMT',
            'Connection',
            'close']);

}
