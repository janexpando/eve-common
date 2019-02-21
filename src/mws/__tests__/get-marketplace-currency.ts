import {test} from "../../testing";
import {getMarketplaceCurrency, MARKETPLACES} from "../..";

test('get marketplace currency for every marketplace', t => {
    for (let marketplace of MARKETPLACES) {
        t.truthy(getMarketplaceCurrency(marketplace));
    }
});
