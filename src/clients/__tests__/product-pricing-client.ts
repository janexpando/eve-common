import nock = require('nock');
import {Environment, ENVIRONMENT_PROVIDER} from "../..";
import {ProductPricingClient} from "../product-pricing-client";
import {provideInjector, test} from "../../testing";

provideInjector(test, [ProductPricingClient, ENVIRONMENT_PROVIDER]);
test.serial('get pricing for product', async t => {

    let client = t.context.injector.get(ProductPricingClient);
    let env = t.context.injector.get(Environment);
    // nock.recorder.rec();
    nock(env.PRICING_SERVICE_URL, { 'encodedQueryParams': true })
        .get('/marketplace/amazon_de/asin/B002W5S2IS', { 'sellerId': 'A11ECV7XDUNWGU' })
        .reply(200, {
            'summary': {
                'lowest': { 'landed': 49.8, 'listing': 49.8, 'shipping': 0, 'channel': 'Merchant' },
                'buyBox': { 'landed': 50.03, 'listing': 50.03, 'shipping': 0 }, 'totalOffers': 144,
            }, 'offer': {
                'isBuyBoxWinner': true, 'isFeaturedMerchant': true, 'isFulfilledByAmazon': false,
                'sellerId': 'A11ECV7XDUNWGU', 'listingPrice': 50.03, 'shippingPrice': 0,
                'feedback': { 'count': 7170, 'rating': 99 }, 'shippingTime': { 'minimumHours': 24, 'maximumHours': 48 },
            },
        }, ['Content-Type',
            'application/json; charset=utf-8',
            'Content-Length',
            '404',
            'Date',
            'Wed, 22 May 2019 10:04:56 GMT',
            'Connection',
            'close'] as any);

    nock(env.PRICING_SERVICE_URL, { 'encodedQueryParams': true })
        .get('/marketplace/amazon_de/asin/B002W5S2IS_X', { 'sellerId': 'A11ECV7XDUNWGU' })
        .reply(204, '', ['Date', 'Wed, 22 May 2019 10:04:56 GMT', 'Connection', 'close'] as any);

    let pricing = await client.getPricing('amazon_de', 'B002W5S2IS', 'A11ECV7XDUNWGU');
    let emptyPricing = await client.getPricing('amazon_de', 'B002W5S2IS_X', 'A11ECV7XDUNWGU');

    t.deepEqual(pricing, {
        'summary': {
            'lowest': {
                'landed': 49.8,
                'listing': 49.8,
                'shipping': 0,
                'channel': 'Merchant',
            },
            'buyBox': {
                'landed': 50.03,
                'listing': 50.03,
                'shipping': 0,
            },
            'totalOffers': 144,
        },
        'offer': {
            'isBuyBoxWinner': true,
            'isFeaturedMerchant': true,
            'isFulfilledByAmazon': false,
            'sellerId': 'A11ECV7XDUNWGU',
            'listingPrice': 50.03,
            'shippingPrice': 0,
            'feedback': {
                'count': 7170,
                'rating': 99,
            },
            'shippingTime': {
                'minimumHours': 24,
                'maximumHours': 48,
            },
        },
    });
    t.deepEqual(emptyPricing, null);
});