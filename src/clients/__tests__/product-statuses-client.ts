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

    nock(`${env.PRODUCT_SERVICE_URL}`, {"encodedQueryParams":true})
        .get('/company/5d5d3fe4ff54a60ef331dcbb/marketplace/amazon_de/sku/SKU1/product-statuses')
        .reply(200, {"_id":"5d5d3fe4ff54a60ef331dcbc","companyId":"5d5d3fe4ff54a60ef331dcbb","sku":"SKU1","marketplace":"amazon_de","hasAsin":true,"hasStock":true,"hasValidBarcode":true,"isBuyBoxWinner":true,"listingStatus":"ok","listingErrors":[],"status":"paused","forbidListing":true,"__v":0}, [ 'X-DNS-Prefetch-Control',
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
            'close' ] as any);

    nock(`${env.PRODUCT_SERVICE_URL}`, {"encodedQueryParams":true})
        .get('/company/5d5d3fe4ff54a60ef331dcbb/marketplace/amazon_de/sku/SKU2/product-statuses')
        .reply(200, {"companyId":"5d5d3fe4ff54a60ef331dcbb","marketplace":"amazon_de","sku":"SKU2","hasAsin":false,"hasStock":false,"hasValidBarcode":false,"isBuyBoxWinner":false,"listingStatus":null,"listingErrors":[],"status":null,"forbidListing":false}, [ 'X-DNS-Prefetch-Control',
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
            'close' ] as any);

    let result1 = await client.get(companyId, marketplace, sku1);
    let result2 = await client.get(companyId, marketplace, sku2);

    delete (result1 as any).__v;
    delete (result1 as any)._id;

    delete (result2 as any).__v;
    delete (result2 as any)._id;

    result1.companyId = new ObjectId(result1.companyId );
    result2.companyId = new ObjectId(result1.companyId );

    t.deepEqual(result1, productStatuses);
    t.deepEqual(result2, defaultProductStatuses);
});