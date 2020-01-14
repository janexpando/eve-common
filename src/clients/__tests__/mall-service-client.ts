import * as nock from "nock";
import { ObjectId } from "bson";
import { provideInjector, test } from "../../testing";
import {
  ApiMallFulfillment,
  ApiMallFulfillmentResponse,
  MallServiceClient
} from "../mall-service-client";
import {Environment} from "../..";

provideInjector(test);

test.serial("fulfill mall order", async t => {
  // nock.recorder.rec();
  const mallServiceClient = t.context.injector.get(MallServiceClient);
  const env = t.context.injector.get(Environment);
  const companyId = new ObjectId("5e1dcb382efb3a6fa7ea48ca");
  const fulfillment: ApiMallFulfillment = {
    companyId,
    marketplaceOrderId: "12345",
    marketplace: "mall_cz",
    trackingNumber: "trackingNumber",
    trackingUrl: "trackingUrl"
  };
  nock(env.MALL_SERVICE_URL, {"encodedQueryParams":true})
      .post('/company/5e1dcb382efb3a6fa7ea48ca/fulfillment', {"fulfillment":{"companyId":"5e1dcb382efb3a6fa7ea48ca","marketplaceOrderId":"12345","marketplace":"mall_cz","trackingNumber":"trackingNumber","trackingUrl":"trackingUrl"}})
      .reply(200, {fulfilled: true}, [ 'Date', 'Tue, 14 Jan 2020 14:07:52 GMT', 'Connection', 'close' ]);

  const result: ApiMallFulfillmentResponse = await mallServiceClient.fulfillOrder(
    companyId,
    fulfillment
  );

  t.deepEqual(result, { fulfilled: true });
});
