import nock = require('nock');
import {Environment, ENVIRONMENT_PROVIDER, MarketplaceName} from "../..";
import {provideInjector, test} from "../../testing";
import {ListingStatusKind, ProductStatusesClient, ProductStatusKind} from "../product-statuses-client";
import {ObjectId} from "bson";

provideInjector(test, [ProductStatusesClient, ENVIRONMENT_PROVIDER]);
test.serial('get product statuses', async t => {

    let client = t.context.injector.get(ProductStatusesClient);
    let env = t.context.injector.get(Environment);

    // nock.recorder.rec();

    let companyId = new ObjectId("5d5d3fe4ff54a60ef331dcbb");
    let marketplace = "amazon_de" as MarketplaceName;
    let sku1 = "SKU1";
    let sku2 = "SKU2";

    let productStatuses = {
        companyId,
        marketplace,
        sku: sku1,
        hasAsin: true,
        hasStock: true,
        hasValidBarcode: true,
        isBuyBoxWinner: true,
        listingStatus: "ok" as ListingStatusKind,
        listingErrors: [],
        status: "paused" as ProductStatusKind,
        forbidListing: true
    };

    let defaultProductStatuses = {
        companyId,
        marketplace,
        sku: sku2,
        hasAsin: false,
        hasStock: false,
        hasValidBarcode: false,
        isBuyBoxWinner: false,
        listingStatus: null,
        listingErrors: [],
        status: null,
        forbidListing: false
    };

    nock(`${env.PRODUCT_SERVICE_URL}`, { "encodedQueryParams": true })
        .get('/company/5d5d3fe4ff54a60ef331dcbb/marketplace/amazon_de/sku/SKU1/product-statuses')
        .reply(200, {
            "_id": "5d5d3fe4ff54a60ef331dcbc",
            "companyId": "5d5d3fe4ff54a60ef331dcbb",
            "sku": "SKU1",
            "marketplace": "amazon_de",
            "hasAsin": true,
            "hasStock": true,
            "hasValidBarcode": true,
            "isBuyBoxWinner": true,
            "listingStatus": "ok",
            "listingErrors": [],
            "status": "paused",
            "forbidListing": true,
            "__v": 0
        }, ['X-DNS-Prefetch-Control',
            'off',
            'X-Frame-Options',
            'SAMEORIGIN',
            'Strict-Transport-Security',
            'max-age=15552000; includeSubDomains',
            'X-Download-Options',
            'noopen',
            'X-Content-Type-Options',
            'nosniff',
            'X-XSS-Protection',
            '1; mode=block',
            'Content-Type',
            'application/json; charset=utf-8',
            'Content-Length',
            '275',
            'Date',
            'Wed, 21 Aug 2019 13:22:49 GMT',
            'Connection',
            'close'] as any);

    nock(`${env.PRODUCT_SERVICE_URL}`, { "encodedQueryParams": true })
        .get('/company/5d5d3fe4ff54a60ef331dcbb/marketplace/amazon_de/sku/SKU2/product-statuses')
        .reply(200, {
            "companyId": "5d5d3fe4ff54a60ef331dcbb",
            "marketplace": "amazon_de",
            "sku": "SKU2",
            "hasAsin": false,
            "hasStock": false,
            "hasValidBarcode": false,
            "isBuyBoxWinner": false,
            "listingStatus": null,
            "listingErrors": [],
            "status": null,
            "forbidListing": false
        }, ['X-DNS-Prefetch-Control',
            'off',
            'X-Frame-Options',
            'SAMEORIGIN',
            'Strict-Transport-Security',
            'max-age=15552000; includeSubDomains',
            'X-Download-Options',
            'noopen',
            'X-Content-Type-Options',
            'nosniff',
            'X-XSS-Protection',
            '1; mode=block',
            'Content-Type',
            'application/json; charset=utf-8',
            'Content-Length',
            '235',
            'Date',
            'Wed, 21 Aug 2019 13:22:49 GMT',
            'Connection',
            'close'] as any);

    let result1 = await client.getProductStatuses(companyId, marketplace, sku1);
    let result2 = await client.getProductStatuses(companyId, marketplace, sku2);

    delete (result1 as any).__v;
    delete (result1 as any)._id;

    delete (result2 as any).__v;
    delete (result2 as any)._id;

    result1.companyId = new ObjectId(result1.companyId);
    result2.companyId = new ObjectId(result1.companyId);

    t.deepEqual(result1, productStatuses);
    t.deepEqual(result2, defaultProductStatuses);
});

function makeCreateProductStatusWithStatus(companyId: ObjectId) {
    return function createProductStatusWithStatus(status: ProductStatusKind, sku: string, marketplace: MarketplaceName) {
        return {
            companyId,
            marketplace,
            sku,
            hasAsin: true,
            hasStock: true,
            hasValidBarcode: true,
            isBuyBoxWinner: true,
            listingStatus: "ok" as ListingStatusKind,
            listingErrors: [],
            status: status as ProductStatusKind,
            forbidListing: false
        }
    }
}

function cleanUpResult(result) {
    delete (result as any).__v;
    delete (result as any)._id;
    result.companyId = new ObjectId(result.companyId);
    return result
}

test.serial('get product stats summary', async t => {

    let client = t.context.injector.get(ProductStatusesClient);
    let env = t.context.injector.get(Environment);

    // nock.recorder.rec();

    nock(`${env.PRODUCT_SERVICE_URL}`, {"encodedQueryParams":true})
        .post('/company/5d5d3fe4ff54a60ef331dcbb/product-stats', {"marketplace":"amazon_de"})
        .reply(200, {"companyId":"5d5d3fe4ff54a60ef331dcbb","marketplace":"amazon_de","ok":2,"paused":3,"notFound":0,"error":0,"missingBarcode":0}, [ 'X-DNS-Prefetch-Control',
            'off',
            'X-Frame-Options',
            'SAMEORIGIN',
            'Strict-Transport-Security',
            'max-age=15552000; includeSubDomains',
            'X-Download-Options',
            'noopen',
            'X-Content-Type-Options',
            'nosniff',
            'X-XSS-Protection',
            '1; mode=block',
            'Content-Type',
            'application/json; charset=utf-8',
            'Content-Length',
            '126',
            'Date',
            'Wed, 28 Aug 2019 12:39:42 GMT',
            'Connection',
            'close' ] as any);

    nock(`${env.PRODUCT_SERVICE_URL}`, {"encodedQueryParams":true})
        .post('/company/5d5d3fe4ff54a60ef331dcbb/product-stats', {"marketplace":["amazon_de","amazon_it"]})
        .reply(200, {"companyId":"5d5d3fe4ff54a60ef331dcbb","marketplace":["amazon_de","amazon_it"],"ok":2,"paused":4,"notFound":1,"error":0,"missingBarcode":0}, [ 'X-DNS-Prefetch-Control',
            'off',
            'X-Frame-Options',
            'SAMEORIGIN',
            'Strict-Transport-Security',
            'max-age=15552000; includeSubDomains',
            'X-Download-Options',
            'noopen',
            'X-Content-Type-Options',
            'nosniff',
            'X-XSS-Protection',
            '1; mode=block',
            'Content-Type',
            'application/json; charset=utf-8',
            'Content-Length',
            '140',
            'Date',
            'Wed, 28 Aug 2019 12:39:42 GMT',
            'Connection',
            'close' ] as any);

    let companyId = new ObjectId("5d5d3fe4ff54a60ef331dcbb");
    let marketplace1 = "amazon_de" as MarketplaceName;
    let marketplace2 = "amazon_it" as MarketplaceName;
    let marketplace3 = "amazon_fr" as MarketplaceName;
    let marketplaces = ["amazon_de", "amazon_it"] as MarketplaceName[];

    let productStatusesToBeCreated = [{ status: "ok", sku: "SKU1", marketplace: marketplace1 }, {
        status: "ok",
        sku: "SKU2",
        marketplace: marketplace1
    }, { status: "paused", sku: "SKU1", marketplace: marketplace1 }, {
        status: "paused",
        sku: "SKU2",
        marketplace: marketplace1
    }, { status: "paused", sku: "SKU3", marketplace: marketplace1 }, {
        status: "paused",
        sku: "SKU1",
        marketplace: marketplace2
    }, { status: "notFound", sku: "SKU1", marketplace: marketplace2 }, {
        status: "error",
        sku: "SKU1",
        marketplace: marketplace3
    }];

    let productStatuses = [];

    let createProductStatusWithStatus = makeCreateProductStatusWithStatus(companyId);

    for (let product of productStatusesToBeCreated) {
        productStatuses.push(createProductStatusWithStatus(product.status as ProductStatusKind, product.sku, product.marketplace));
    }

    let result1 = await client.getProductStats(companyId, marketplace1);
    let result2 = await client.getProductStats(companyId, marketplaces);

    result1 = cleanUpResult(result1);
    result2 = cleanUpResult(result2);

    let productStats1 = {
        companyId,
        marketplace: marketplace1,
        ok: 2,
        paused: 3,
        notFound: 0,
        error: 0,
        missingBarcode: 0
    };

    let productStats2 = {
        companyId,
        marketplace: marketplaces,
        ok: 2,
        paused: 4,
        notFound: 1,
        error: 0,
        missingBarcode: 0
    };

    t.deepEqual(result1, productStats1);
    t.deepEqual(result2, productStats2);
});