import {test} from "../../testing";
import {convertCurrency} from "../money-exchange";

test("czk to eur", t => {
    t.is(convertCurrency(25.59, 'CZK', "EUR"), 1);
    t.is(Math.round(convertCurrency(23.25, 'CZK', "USD")), 1);
    t.is(Math.round(convertCurrency(2, 'USD', "CZK")), 47);
    t.is(convertCurrency(null, null, null), 0)
});

