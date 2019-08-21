import {test} from "../../testing";
import {AMAZON} from "../../models/marketplace-names";
import {getMarketplaceId} from "../get-marketplace-id";

test('get marketplace id for every marketplace', t => {
    for (let marketplace of AMAZON) {
        t.truthy(getMarketplaceId(marketplace));
    }
});
