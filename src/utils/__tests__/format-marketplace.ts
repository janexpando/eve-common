import { test } from '../../testing';
import { formatMarketplace } from '../format-marketplace';

test('Format marketplace', t => {
    const marketplace = 'alza_cz';
    const result = formatMarketplace(marketplace);

    t.is(result, 'Alza CZ', 'Marketplace not formatted correctly.');
});
