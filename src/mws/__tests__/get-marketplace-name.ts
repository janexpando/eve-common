import {test} from "../../testing";
import {getMarketplaceId, getMarketplaceName, MARKETPLACES} from "../..";


test('get marketplace name for every marketplaceId', t => {
    for (let marketplace of MARKETPLACES) {
        t.truthy(getMarketplaceName(getMarketplaceId(marketplace)));
    }
});
