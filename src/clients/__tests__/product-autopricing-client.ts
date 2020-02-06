import { provideInjector, test } from '../../testing';
import { ProductAutopricingClient } from '../product-autopricing-client';
import nock = require('nock');
import { ObjectId } from 'bson';
import {Environment} from "../..";

provideInjector(test);

test.serial('modify product autopricing settings', async t => {
    // nock.recorder.rec();
    const companyId = new ObjectId('5e3c16ef80039d91b45cf4cc');
    const marketplace = 'amazon_de';
    const sku = '123';
    const client = t.context.injector.get(ProductAutopricingClient);
    const environment = t.context.injector.get(Environment);

    nock(environment.PRODUCT_SERVICE_URL, {"encodedQueryParams":true})
        .post('/company/5e3c16ef80039d91b45cf4cc/marketplace/amazon_de/product-autopricing/active', {"skus":["123"],"active":true})
        .reply(200, {}, [ 'X-DNS-Prefetch-Control',
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
            '2',
            'Date',
            'Thu, 06 Feb 2020 15:11:10 GMT',
            'Connection',
            'close' ]);

    const response = await client.setActiveState(companyId, marketplace, [sku], true);
    t.is(response.statusCode, 200);
});
