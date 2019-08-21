import {test} from "../../testing";
import {AMAZON} from "../../models/marketplace-names";
import {getMarketplaceName} from "../get-marketplace-name";
import {getMarketplaceId} from "../get-marketplace-id";


test('get marketplace name for every marketplaceId', t => {
    for (let marketplace of AMAZON) {
        t.truthy(getMarketplaceName(getMarketplaceId(marketplace)));
    }
});
