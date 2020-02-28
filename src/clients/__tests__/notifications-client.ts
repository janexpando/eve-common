import { provideInjector, test } from '../../testing';
import { NotificationsClient } from '../notifications-client';
import { ObjectId } from 'bson';
import * as nock from 'nock';
import { AmazonType, Environment } from '../..';

provideInjector(test);

test.serial('notify about suspended account', async t => {
    // nock.recorder.rec();
    const client = t.context.injector.get(NotificationsClient);
    const environment = t.context.injector.get(Environment);
    const companyId = new ObjectId('5e17324d235a3bf11c1e926e');
    const marketplace = "amazon_de" as AmazonType;
    nock(`${environment.GATEWAY_URL}`, { encodedQueryParams: true })
        .post('/notification/suspended-account', {
            companyId: '5e17324d235a3bf11c1e926e',
            marketplace: "amazon_de"
        })
        .reply(200, { success: true }, [
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
            '16',
            'Date',
            'Thu, 09 Jan 2020 14:01:49 GMT',
            'Connection',
            'close',
        ]);
    const response = await client.notifySuspendedAmazonMarketplace(companyId, marketplace);
    t.deepEqual(response, { success: true });
});
