import { test } from '../../testing';
import { TempFile } from '../temp-file';
import { pipeline } from '../../utils';
import { stringToReadable } from '../string-to-readable';

test.serial('tempfile should be able to write and read', async t => {
    let content = 'lorem ipsum';
    let file = new TempFile({ prefix: '/tmp/' });
    await pipeline(stringToReadable(content), file.createWriteStream());
    for await (let item of file.createReadStream()) {
        t.is(item.toString(), content);
    }
});
