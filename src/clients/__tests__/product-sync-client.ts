import { ProductSyncClient, ApiProductSync } from '../product-sync-client';
import { ObjectId } from 'bson';
import nock = require('nock');
import timekeeper = require('timekeeper');
import {provideInjector, test} from "../../testing";
import {Environment, ENVIRONMENT_PROVIDER} from "../..";

provideInjector(test, [ProductSyncClient, ENVIRONMENT_PROVIDER]);
test.serial('get product sync', async t => {
    timekeeper.freeze(1557393716603);

    const cid = '5c52d0bfbf23ae00046927a8';
    let companyId = new ObjectId(cid);
    let environment = t.context.injector.get(Environment);

    let date = new Date(Date.now());
    let sync = {
        companyId,
        jobId: new ObjectId(),
        interval: 180,
        startedOn: date,
        finishedOn: date,
        feedDownloadStartedOn: date,
        feedDownloadFinishedOn: date,
    };

    let restSync: ApiProductSync = sync as any;
    restSync.isFeedSyncing = false;
    restSync.isSyncing = false;
    delete (restSync as any).jobId;
    delete (restSync as any).companyId;

    nock(`${environment.PRODUCT_SERVICE_URL}`)
        .get(`/company/${cid}/product-sync`)
        .reply(200, restSync);

    let result = await t.context.injector
        .get(ProductSyncClient)
        .getProductSync(companyId);

    t.deepEqual(result, restSync);
});
