import {test} from "../../testing";
import {getMarketplaceId, MARKETPLACES} from "../..";

test('get marketplace id for every marketplace', t => {
    for (let marketplace of MARKETPLACES) {
        t.truthy(getMarketplaceId(marketplace));
    }
});
