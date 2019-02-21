import {test} from "../../testing";
import {getMarketplaceHost, MARKETPLACES} from "../..";

test('get marketplace host for every marketplace', t => {
    for (let marketplace of MARKETPLACES) {
        t.truthy(getMarketplaceHost(marketplace));
    }
});
