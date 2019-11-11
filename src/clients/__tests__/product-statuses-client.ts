import nock = require('nock');
import {AmazonType, ApiProductStats, Environment, ENVIRONMENT_PROVIDER, MarketplaceName} from "../..";
import {provideInjector, test} from "../../testing";
import {ListingStatusKind, ProductStatusesClient, ProductStatusKind} from "../product-statuses-client";
import {ObjectId} from "bson";

provideInjector(test, [ProductStatusesClient, ENVIRONMENT_PROVIDER]);

function makeCreateProductStatusWithStatus(companyId: ObjectId) {
    return function createProductStatusWithStatus(status: ProductStatusKind, sku: string, marketplace: MarketplaceName, hasStock: boolean) {
        return {
            companyId,
            marketplace,
            sku,
            hasAsin: true,
            hasStock,
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
        .post('/company/5d5d3fe4ff54a60ef331dcbb/product-stats', {"marketplaces":["amazon_de"],"hasStockFilter":null})
        .reply(200, {"companyId":"5d5d3fe4ff54a60ef331dcbb","marketplaces":["amazon_de"],"ok":2,"paused":3,"notFound":0,"error":0,"missingBarcode":0}, [ 'X-DNS-Prefetch-Control',
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
            '129',
            'Date',
            'Mon, 11 Nov 2019 10:32:44 GMT',
            'Connection',
            'close' ] as any);

    nock(`${env.PRODUCT_SERVICE_URL}`, {"encodedQueryParams":true})
        .post('/company/5d5d3fe4ff54a60ef331dcbb/product-stats', {"marketplaces":["amazon_de","amazon_it"],"hasStockFilter":true})
        .reply(200, {"companyId":"5d5d3fe4ff54a60ef331dcbb","marketplaces":["amazon_de","amazon_it"],"ok":1,"paused":3,"notFound":1,"error":0,"missingBarcode":0}, [ 'X-DNS-Prefetch-Control',
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
            '141',
            'Date',
            'Mon, 11 Nov 2019 10:32:44 GMT',
            'Connection',
            'close' ] as any);

    nock(`${env.PRODUCT_SERVICE_URL}`, {"encodedQueryParams":true})
        .post('/company/5d5d3fe4ff54a60ef331dcbb/product-stats', {"marketplaces":["amazon_de","amazon_it"],"hasStockFilter":false})
        .reply(200, {"companyId":"5d5d3fe4ff54a60ef331dcbb","marketplaces":["amazon_de","amazon_it"],"ok":1,"paused":1,"notFound":0,"error":0,"missingBarcode":0}, [ 'X-DNS-Prefetch-Control',
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
            '141',
            'Date',
            'Mon, 11 Nov 2019 10:32:44 GMT',
            'Connection',
            'close' ] as any);

    let companyId = new ObjectId("5d5d3fe4ff54a60ef331dcbb");
    let marketplace1 = "amazon_de" as AmazonType;
    let marketplace2 = "amazon_it" as AmazonType;
    let marketplace3 = "amazon_fr" as AmazonType;
    let marketplaces = ["amazon_de", "amazon_it"] as AmazonType[];

    let productStatusesToBeCreated = [{ status: "ok", sku: "SKU1", marketplace: marketplace1, hasStock: true }, {
        status: "ok",
        sku: "SKU2",
        marketplace: marketplace1,
        hasStock: false
    }, { status: "paused", sku: "SKU4", marketplace: marketplace1, hasStock: false }, {
        status: "paused",
        sku: "SKU2",
        marketplace: marketplace1,
        hasStock: true
    }, { status: "paused", sku: "SKU3", marketplace: marketplace1, hasStock: true }, {
        status: "paused",
        sku: "SKU1",
        marketplace: marketplace2, hasStock: true
    }, { status: "notFound", sku: "SKU1", marketplace: marketplace2, hasStock: true }, {
        status: "error",
        sku: "SKU1",
        marketplace: marketplace3, hasStock: true
    }];

    let productStatuses = [];

    let createProductStatusWithStatus = makeCreateProductStatusWithStatus(companyId);

    for (let product of productStatusesToBeCreated) {
        productStatuses.push(createProductStatusWithStatus(product.status as ProductStatusKind, product.sku, product.marketplace, product.hasStock));
    }

    let result1 = await client.getProductStats(companyId, [marketplace1], null);
    let result2 = await client.getProductStats(companyId, marketplaces, true);
    let result3 = await client.getProductStats(companyId, marketplaces, false);

    result1 = cleanUpResult(result1);
    result2 = cleanUpResult(result2);
    result3 = cleanUpResult(result3);

    let productStats1: ApiProductStats = {
        companyId,
        marketplaces: [marketplace1],
        ok: 2,
        paused: 3,
        notFound: 0,
        error: 0,
        missingBarcode: 0
    };

    let productStats2: ApiProductStats = {
        companyId,
        marketplaces: marketplaces,
        ok: 1,
        paused: 3,
        notFound: 1,
        error: 0,
        missingBarcode: 0
    };

    let productStats3: ApiProductStats = {
        companyId,
        marketplaces: marketplaces,
        ok: 1,
        paused: 1,
        notFound: 0,
        error: 0,
        missingBarcode: 0
    };

    t.deepEqual(result1, productStats1);
    t.deepEqual(result2, productStats2);
    t.deepEqual(result3, productStats3);
});