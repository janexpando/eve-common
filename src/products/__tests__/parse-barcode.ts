import { test } from '../../testing';
import { parseBarcode } from '../parse-barcode';

test('it should return wtf type for null code', t => {
    let code = null;
    let result = parseBarcode(code);
    t.deepEqual(result, {
        code: null,
        type: 'wtf',
    });
});
