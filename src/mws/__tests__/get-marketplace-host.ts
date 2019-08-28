import {test} from "../../testing";
import {getMarketplaceHost, MARKETPLACES} from "../..";
import {AMAZON} from "../../models/marketplace-names";

test('get marketplace host for every marketplace', t => {
    for (let marketplace of AMAZON) {
        t.truthy(getMarketplaceHost(marketplace));
    }
});
