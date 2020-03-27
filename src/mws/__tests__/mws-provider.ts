import MWS = require('amazon-mws');
import nock = require('nock');
import { prepareDB, provideInjector, test } from '../../testing';
import { getMarketplaceId } from '../get-marketplace-id';
import { MwsProvider } from '../mws-provider';
import { Environment } from '../../bootstrapping/environment';
import { ObjectId } from 'bson';

provideInjector(test);
prepareDB(test);

test.after.always(() => nock.restore());

test.serial('mws function returns instance of the mws object for existing pair companyId and marketplace', async t => {
    const developerId = 'developer-id';
    const marketplace = 'amazon_uk';
    let marketplaceId = getMarketplaceId(marketplace);
    let environment = t.context.injector.get(Environment);
    let companyId = new ObjectId();
    nock.disableNetConnect();

    nock(environment.COMPANY_SERVICE_URL)
        .get(`/developer-config/${developerId}`)
        .reply(200, {
            developerId,
            accessKey: 'accessKey',
            secretKey: 'secretKey',
            region: 'amazon_europe',
        });

    let token = 'amzn.mws.3ca8c68a-99ab-c228-bd69-e7e60db7a100';
    let sellerId = 'A11ECV7XDUNW1AB';
    nock(environment.COMPANY_SERVICE_URL)
        .get(`/company/${companyId}/marketplace/${marketplace}/mws-credentials`)
        .reply(200, {
            developerId,
            marketplaceId,
            sellerId,
            token,
        });

    let provider = t.context.injector.get(MwsProvider);

    const { mws, options } = await provider.getMws(companyId, marketplace);
    t.truthy(mws instanceof MWS);
    t.is(options.MWSAuthToken, token);
    t.is(options.MarketplaceId, marketplaceId);
    t.is(options.SellerId, sellerId);
});
